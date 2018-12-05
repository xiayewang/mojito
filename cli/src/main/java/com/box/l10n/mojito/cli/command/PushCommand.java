package com.box.l10n.mojito.cli.command;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import com.box.l10n.mojito.cli.ConsoleWriter;
import com.box.l10n.mojito.cli.command.param.Param;
import com.box.l10n.mojito.cli.filefinder.FileMatch;
import com.box.l10n.mojito.cli.filefinder.file.FileType;
import com.box.l10n.mojito.cli.filefinder.file.XcodeXliffFileType;
import com.box.l10n.mojito.rest.client.AssetClient;
import com.box.l10n.mojito.rest.client.RepositoryClient;
import com.box.l10n.mojito.rest.client.UserClient;
import com.box.l10n.mojito.rest.client.exception.PollableTaskException;
import com.box.l10n.mojito.rest.client.exception.ResourceNotCreatedException;
import com.box.l10n.mojito.rest.entity.*;
import com.google.common.collect.Sets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.RandomStringUtils;
import org.fusesource.jansi.Ansi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * @author jaurambault
 */
@Component
@Scope("prototype")
@Parameters(commandNames = {"push", "p"}, commandDescription = "Push assets to be localized to TMS")
public class PushCommand extends Command {

    /**
     * logger
     */
    static Logger logger = LoggerFactory.getLogger(PushCommand.class);

    @Autowired
    ConsoleWriter consoleWriter;

    @Parameter(names = {Param.REPOSITORY_LONG, Param.REPOSITORY_SHORT}, arity = 1, required = true, description = Param.REPOSITORY_DESCRIPTION)
    String repositoryParam;

    @Parameter(names = {Param.SOURCE_DIRECTORY_LONG, Param.SOURCE_DIRECTORY_SHORT}, arity = 1, required = false, description = Param.SOURCE_DIRECTORY_DESCRIPTION)
    String sourceDirectoryParam;

    @Parameter(names = {Param.FILE_TYPE_LONG, Param.FILE_TYPE_SHORT}, arity = 1, required = false, description = Param.FILE_TYPE_DESCRIPTION,
            converter = FileTypeConverter.class)
    FileType fileType;

    @Parameter(names = {Param.SOURCE_LOCALE_LONG, Param.SOURCE_LOCALE_SHORT}, arity = 1, required = false, description = Param.SOURCE_LOCALE_DESCRIPTION)
    String sourceLocale;

    @Parameter(names = {Param.SOURCE_REGEX_LONG, Param.SOURCE_REGEX_SHORT}, arity = 1, required = false, description = Param.SOURCE_REGEX_DESCRIPTION)
    String sourcePathFilterRegex;

    @Parameter(names = {"-b", "--branch"}, arity = 1, required = false, description = "branch")
    String branchName;

    @Parameter(names = {Param.USERNAME_LONG, Param.USERNAME_SHORT}, arity = 1, required = false, description = "username of text unit author")
    String username;

    @Autowired
    AssetClient assetClient;

    @Autowired
    RepositoryClient repositoryClient;

    @Autowired
    UserClient userClient;

    @Autowired
    CommandHelper commandHelper;

    CommandDirectories commandDirectories;

    @Override
    public void execute() throws CommandException {

        if(username != null) {
            try {
                userClient.createUser(username, RandomStringUtils.randomAlphanumeric(15), Role.USER, null, null, null);
                consoleWriter.a("creating user: ").fg(Ansi.Color.DEFAULT).a(username).println();
            } catch (ResourceNotCreatedException e) {
                consoleWriter.a("creating user: ").fg(Ansi.Color.DEFAULT).a(e.getMessage()).println();
            }
        }

        commandDirectories = new CommandDirectories(sourceDirectoryParam);

        consoleWriter.newLine().a("Push assets to repository: ").fg(Ansi.Color.CYAN).a(repositoryParam).println(2);

        Repository repository = commandHelper.findRepositoryByName(repositoryParam);
        List<PollableTask> pollableTasks = new ArrayList<>();

        ArrayList<FileMatch> sourceFileMatches = commandHelper.getSourceFileMatches(commandDirectories, fileType, sourceLocale, sourcePathFilterRegex);
        Set<Long> usedAssetIds = new HashSet<>();

        for (FileMatch sourceFileMatch : sourceFileMatches) {

            String sourcePath = sourceFileMatch.getSourcePath();

            String assetContent = commandHelper.getFileContent(sourceFileMatch.getPath());

            // TODO(P1) This is to inject xml:space="preserve" in the trans-unit element
            // in the xcode-generated xliff until xcode fixes the bug of not adding this attribute
            // See Xcode bug http://www.openradar.me/23410569
            if (XcodeXliffFileType.class == sourceFileMatch.getFileType().getClass()) {
                assetContent = commandHelper.setPreserveSpaceInXliff(assetContent);
            }

            SourceAsset sourceAsset = new SourceAsset();
            sourceAsset.setBranch(branchName);
            sourceAsset.setUsername(username);
            sourceAsset.setPath(sourcePath);
            sourceAsset.setContent(assetContent);
            sourceAsset.setRepositoryId(repository.getId());
            sourceAsset.setFilterConfigIdOverride(sourceFileMatch.getFileType().getFilterConfigIdOverride());
           
            consoleWriter.a(" - Uploading: ").fg(Ansi.Color.CYAN).a(sourcePath).println();

            SourceAsset assetAfterSend = assetClient.sendSourceAsset(sourceAsset);
            pollableTasks.add(assetAfterSend.getPollableTask());

            consoleWriter.a(" --> asset id: ").fg(Ansi.Color.MAGENTA).a(assetAfterSend.getAddedAssetId()).println();
            usedAssetIds.add(assetAfterSend.getAddedAssetId());
        }

        try {
            logger.debug("Wait for all \"push\" tasks to be finished");
            for (PollableTask pollableTask : pollableTasks) {
                commandHelper.waitForPollableTask(pollableTask.getId());
            }
        } catch (PollableTaskException e) {
            throw new CommandException(e.getMessage(), e.getCause());
        }

        Branch branch = repositoryClient.getBranch(repository.getId(), branchName);

        logger.debug("process deleted assets here");
        Set<Long> assetIds = Sets.newHashSet(assetClient.getAssetIds(repository.getId(), false, false, branch.getId()));

        assetIds.removeAll(usedAssetIds);
        if (!assetIds.isEmpty()) {
            assetClient.deleteAssetsInBranch(assetIds, branch.getId());
            consoleWriter.newLine().a("Delete assets from repository, ids: ").fg(Ansi.Color.CYAN).a(assetIds.toString()).println(2);
        }

        consoleWriter.fg(Ansi.Color.GREEN).newLine().a("Finished").println(2);
    }
}

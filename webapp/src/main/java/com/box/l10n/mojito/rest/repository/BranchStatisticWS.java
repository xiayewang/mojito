package com.box.l10n.mojito.rest.repository;

import com.box.l10n.mojito.entity.Branch;
import com.box.l10n.mojito.entity.BranchStatistic;
import com.box.l10n.mojito.json.ObjectMapper;
import com.box.l10n.mojito.rest.View;
import com.box.l10n.mojito.service.assetExtraction.AssetExtractionService;
import com.box.l10n.mojito.service.branch.BranchRepository;
import com.box.l10n.mojito.service.branch.BranchStatisticRepository;
import com.box.l10n.mojito.service.branch.BranchStatisticService;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * @author jeanaurambault
 */
@RestController
public class BranchStatisticWS {

    /**
     * logger
     */
    static Logger logger = getLogger(BranchStatisticWS.class);

    @Autowired
    BranchRepository branchRepository;

    @Autowired
    BranchStatisticRepository branchStatisticRepository;

    @Autowired
    BranchStatisticService branchStatisticService;

    @JsonView(View.BranchStatistic.class)
    @RequestMapping(value = "/api/branchStatistics", method = RequestMethod.GET)
    public List<BranchStatistic> getBranchesOfRepository() {
        List<BranchStatistic> all = branchStatisticRepository.findAll();
        String branchStatistic = "[\n" +
                "  {\n" +
                "    \"id\": 4,\n" +
                "    \"branch\": {\n" +
                "      \"id\": 4,\n" +
                "      \"name\": \"branch1\",\n" +
                "      \"createdByUser\": {\n" +
                "        \"id\": 2,\n" +
                "        \"username\": \"admin\",\n" +
                "        \"commonName\": null\n" +
                "      },\n" +
                "      \"deleted\": false\n" +
                "    },\n" +
                "    \"branchTextUnitStatistics\": [\n" +
                "      {\n" +
                "        \"id\": 1175,\n" +
                "        \"tmTextUnit\": {\n" +
                "          \"id\": 1283,\n" +
                "          \"name\": \"new_string1\",\n" +
                "          \"content\": \"new string1\"\n" +
                "        },\n" +
                "        \"forTranslationCount\": 21,\n" +
                "        \"totalCount\": 21\n" +
                "      },\n" +
                "      {\n" +
                "        \"id\": 1176,\n" +
                "        \"tmTextUnit\": {\n" +
                "          \"id\": 1284,\n" +
                "          \"name\": \"new_string1.1\",\n" +
                "          \"content\": \"new string1.1\"\n" +
                "        },\n" +
                "        \"forTranslationCount\": 2,\n" +
                "        \"totalCount\": 11\n" +
                "      }\n" +
                "    ]\n" +
                "  },\n" +
                "  {\n" +
                "    \"id\": 5,\n" +
                "    \"branch\": {\n" +
                "      \"id\": 5,\n" +
                "      \"name\": \"branch2\",\n" +
                "      \"createdByUser\": {\n" +
                "        \"id\": 2,\n" +
                "        \"username\": \"admin\",\n" +
                "        \"commonName\": null\n" +
                "      },\n" +
                "      \"deleted\": false\n" +
                "    },\n" +
                "    \"branchTextUnitStatistics\": [\n" +
                "      {\n" +
                "        \"id\": 1176,\n" +
                "        \"tmTextUnit\": {\n" +
                "          \"id\": 1284,\n" +
                "          \"name\": \"new_string2\",\n" +
                "          \"content\": \"new string2\"\n" +
                "        },\n" +
                "        \"forTranslationCount\": 21,\n" +
                "        \"totalCount\": 21\n" +
                "      }\n" +
                "    ]\n" +
                "  }\n" +
                "]";
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(branchStatistic, new TypeReference<List<BranchStatistic>>(){});
        } catch (Exception e) {

        }

        return all;
    }
}

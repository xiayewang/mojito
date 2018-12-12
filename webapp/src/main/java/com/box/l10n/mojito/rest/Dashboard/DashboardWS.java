package com.box.l10n.mojito.rest.Dashboard;

import com.box.l10n.mojito.entity.AssetTextUnit;
import com.box.l10n.mojito.entity.AssetTextUnitToTMTextUnit;
import com.box.l10n.mojito.entity.Branch;
import com.box.l10n.mojito.entity.TMTextUnit;
import com.box.l10n.mojito.entity.security.user.User;
import com.box.l10n.mojito.service.assetExtraction.AssetTextUnitToTMTextUnitRepository;
import com.box.l10n.mojito.service.assetTextUnit.AssetTextUnitRepository;
import com.box.l10n.mojito.service.branch.BranchRepository;
import com.box.l10n.mojito.service.security.user.UserRepository;
import com.box.l10n.mojito.service.tm.TMTextUnitRepository;
import com.google.common.collect.ImmutableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


/**
 * @author xiayewang
 */
@RestController
public class DashboardWS {

    @Autowired
    BranchRepository branchRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TMTextUnitRepository tmTextUnitRepository;

    @Autowired
    AssetTextUnitToTMTextUnitRepository assetTextUnitToTMTextUnitRepository;

    @Autowired
    AssetTextUnitRepository assetTextUnitRepository;

    @RequestMapping(value = "/api/dashboard", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public List<DashboardRow> getDashboardRows(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "branchName", required = false) String branchName
    ) {
        HashMap<Branch, List<TMTextUnit>> branchToTmTextUnits = getBranchToTmTextUnitMapByUsername(username);
        if (branchToTmTextUnits.isEmpty()) {
            branchToTmTextUnits = getBranchToTmTextUnitMapByBranchName(branchName);
        } else if (branchName != null){
            branchToTmTextUnits.entrySet().removeIf(entry -> !branchName.equals(entry.getKey().getName()));
        }

        return convertToDashboardRow(branchToTmTextUnits);
    }

    private HashMap<Branch, List<TMTextUnit>> getBranchToTmTextUnitMapByUsername(String username) {
        User user = userRepository.findByUsername(username);
        List<TMTextUnit> tmTextUnits = tmTextUnitRepository.findByCreatedByUser(user);
        HashMap<Branch, List<TMTextUnit>> branchToTmTextUnits = new HashMap<>();
        for(TMTextUnit tmTextUnit : tmTextUnits) {
            AssetTextUnitToTMTextUnit assetTextUnitToTMTextUnit = assetTextUnitToTMTextUnitRepository.findByTmTextUnit(tmTextUnit);
            Branch branch = assetTextUnitToTMTextUnit.getAssetTextUnit().getBranch();
            List<TMTextUnit> tmTextUnitList = branchToTmTextUnits.getOrDefault(branch, new LinkedList<>());
            tmTextUnitList.add(tmTextUnit);
            branchToTmTextUnits.put(branch, tmTextUnitList);
        }
        return branchToTmTextUnits;
    }

    private HashMap<Branch, List<TMTextUnit>> getBranchToTmTextUnitMapByBranchName(String branchName) {
        HashMap<Branch, List<TMTextUnit>> branchToTmTextUnits = new HashMap<>();
        List<AssetTextUnit> assetTextUnitList = assetTextUnitRepository.findByBranchIn(branchRepository.findByName(branchName));
        for(AssetTextUnit assetTextUnit : assetTextUnitList) {
            List<TMTextUnit> tmTextUnits = branchToTmTextUnits.getOrDefault(assetTextUnit.getBranch(), new LinkedList<>());
            List<Long> tmTextUnitIds = new ImmutableList.Builder<Long>().add(assetTextUnitToTMTextUnitRepository.findByAssetTextUnit(assetTextUnit).getAssetTextUnit().getId()).build();
            tmTextUnits.addAll(tmTextUnitRepository.findByIdIn(tmTextUnitIds));
            branchToTmTextUnits.put(assetTextUnit.getBranch(), tmTextUnits);
        }
        return branchToTmTextUnits;
    }

    private List<DashboardRow> convertToDashboardRow(HashMap<Branch, List<TMTextUnit>> map) {
        List<DashboardRow> dashboardRows = new LinkedList<>();
        for(Map.Entry<Branch, List<TMTextUnit>> entry : map.entrySet()) {
            List<String> textUnitContent = new LinkedList<>();
            DashboardRow dashboardRow = new DashboardRow();
            dashboardRow.setBranchName(entry.getKey().getName());
            dashboardRow.setTextUnits(textUnitContent);
            dashboardRows.add(dashboardRow);

            for(TMTextUnit tmTextUnit: entry.getValue()) {
                textUnitContent.add(tmTextUnit.getContent());
            }
        }
        return dashboardRows;
    }
}

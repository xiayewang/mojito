package com.box.l10n.mojito.rest.Dashboard;

import java.util.List;

public class DashboardRow {
    String branchName;
    List<String> textUnits;


    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public List<String> getTextUnits() {
        return textUnits;
    }

    public void setTextUnits(List<String> textUnits) {
        this.textUnits = textUnits;
    }
}

import alt from "../../alt";

class DashboardPageActions {

    constructor() {
        this.generateActions(
            "updateSearchParams",
            "getBranches",
            "getBranchesSuccess",
            "getBranchesError"
        );
    }
}

export default alt.createActions(DashboardPageActions);
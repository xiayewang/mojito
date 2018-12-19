import alt from "../../alt";

class DashboardActions {

    constructor() {
        this.generateActions(
            "updateSearchParams",
            "getBranches",
            "getBranchesSuccess",
            "getBranchesError"
        );
    }
}

export default alt.createActions(DashboardActions);

import alt from "../alt";

class DashboardActions {

    constructor() {
        this.generateActions(
            "getBranches",
            "getBranchesSuccess",
            "getBranchesError"
        );
    }
}

export default alt.createActions(DashboardActions);

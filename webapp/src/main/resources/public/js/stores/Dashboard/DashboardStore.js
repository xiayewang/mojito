import alt from "../../alt";
import DashboardActions from "../../actions/DashboardActions";
import DashboardDataSource from "../../actions/DashboardDataSource";

class DashboardStore {
    constructor() {
        /**
         *
         * @type {DashboardRow[]}
         */
        this.dashboardRows = [];

        this.bindActions(DashboardActions);
        this.registerAsync(DashboardDataSource);

    }

    getBranches() {
        return this.dashboardRows;

    }

    getBranchesSuccess(dashboardRows) {
        this.dashboardRows = dashboardRows;
    }
}

export default alt.createStore(DashboardStore, "DashboardStore")
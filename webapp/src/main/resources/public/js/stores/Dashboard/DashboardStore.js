import alt from "../../alt";
import DashboardDataSource from "../../actions/dashboard/DashboardDataSource";
import DashboardSearchParamStore from "./DashboardSearchParamStore";
import DashboardPageActions from "../../actions/dashboard/DashboardPageActions";

class DashboardStore {
    constructor() {
        /**
         *
         * @type {BranchStatistics[]}
         */
        this.setDefaultState();

        this.bindActions(DashboardPageActions);
        this.registerAsync(DashboardDataSource);

    }

    setDefaultState() {
        this.dashboardRows = [];
        this.searching = false;
    }

    getBranches() {
        this.waitFor(DashboardSearchParamStore);
        this.getInstance().performDashboardSearch();
        this.isSearching = true;

    }

    getBranchesSuccess(dashboardRows) {
        this.dashboardRows = dashboardRows;
        this.isSearching = false;
    }
}

export default alt.createStore(DashboardStore, "DashboardStore")
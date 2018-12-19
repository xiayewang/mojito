import DashboardClient from "../../sdk/DashboardClient";
import DashboardPageActions from "./DashboardPageActions";
import DashboardSearcherParameters from "../../sdk/DashboardSearcherParameters";
import DashboardSearchParamStore from "../../stores/Dashboard/DashboardSearchParamStore";

const DashboardDataSource = {
    performDashboardSearch: {
        remote() {
            let dashboardSearchParam = DashboardSearchParamStore.getState();
            let dashboardSearcherParameters = new DashboardSearcherParameters();

            if (dashboardSearchParam.searchText) {
                dashboardSearcherParameters.branchName(dashboardSearchParam.searchText);
                dashboardSearcherParameters.username(dashboardSearchParam.searchText);
            }

            if (dashboardSearchParam.isMine) {
                dashboardSearcherParameters.username(USERNAME);
            }

            dashboardSearcherParameters.deleted(dashboardSearchParam.deleted);
            dashboardSearcherParameters.undeleted(dashboardSearchParam.undeleted);

            if (DashboardSearcherParameters.isReadyForDashboardSearching(dashboardSearcherParameters)) {
                return DashboardClient.getBranches(dashboardSearcherParameters);
            }
        },
        success: DashboardPageActions.getBranchesSuccess,
        error: DashboardPageActions.getBranchesError

    }
};

export default DashboardDataSource;
import DashboardClient from "../sdk/DashboardClient";
import DashboardActions from "./DashboardActions";

const DashboardDataSource = {
    getBranches: {
        remote(branchSearcherParameters) {
            return DashboardClient.getBranches(branchSearcherParameters);
        },
        success: DashboardActions.getBranchesSuccess,
        error: DashboardActions.getBranchesError

    }
};

export default DashboardDataSource;
import DashboardClient from "../../sdk/DashboardClient";
import DashboardPageActions from "./DashboardPageActions";
import DashboardSearcherParameters from "../../sdk/DashboardSearcherParameters";
import DashboardSearchParamStore from "../../stores/Dashboard/DashboardSearchParamStore";
import ImageClient from "../../sdk/ImageClient";
import ScreenshotClient from "../../sdk/ScreenshotClient";
import ScreenshotRun from "../../sdk/entity/ScreenshotRun";

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

    },

    performUploadScreenshotImage: {
        remote(dashboardStoreState) {
            let image = dashboardStoreState.image;
            // TODO: get imageName and imageContent
            let imageName = image.file.name;
            let imageContent = image.imagePreviewUrl;
            return ImageClient.uploadImage(imageName, imageContent);
        },
        success: DashboardPageActions.uploadScreenshotImageSuccess,
        error: DashboardPageActions.uploadScreenshotImageError
    },

    performUploadScreenshot: {
        remote(dashboardStoreState) {

            let screenshotRun = ScreenshotRun.branchStatisticsToScreenshotRun(dashboardStoreState.branchStatistics[dashboardStoreState.uploadingIndex], dashboardStoreState.image);
            return ScreenshotClient.createOrUpdateScreenshotRun(screenshotRun)
        },
        success: DashboardPageActions.uploadScreenshotSuccess,
        error: DashboardPageActions.uploadScreenshotError
    }
};

export default DashboardDataSource;
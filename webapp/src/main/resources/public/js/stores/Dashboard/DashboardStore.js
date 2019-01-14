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
        this.images = [];
        this.screenshots = [];
        this.textUnitSelectedForScreenshot = [];
        this.isTextUnitOpen = [];
        this.isScreenshotOpen = [];
    }

    getBranches() {
        this.waitFor(DashboardSearchParamStore);
        this.getInstance().performDashboardSearch();
        this.isSearching = true;

    }

    getBranchesSuccess(dashboardRows) {
        this.dashboardRows = dashboardRows;
        this.isSearching = false;
        this.images = Array.apply(null, Array(dashboardRows.length)).map(function () {
            return null;
        });
        this.isTextUnitOpen = Array.apply(null, Array(dashboardRows.length)).map(function () {
            return false;
        });
        this.isScreenshotOpen = Array.apply(null, Array(dashboardRows.length)).map(function () {
            return false;
        });
        for (let i = 0; i < dashboardRows.length; i++) {
            //TODO: update screenshot data
            this.textUnitSelectedForScreenshot.push(Array.apply(null, Array(dashboardRows[i].branchTextUnitStatistics.length)).map(function () {
                return false
            }));
        }


    }

    onTextunitCollapseChange(index) {
        this.isTextUnitOpen[index] = !this.isTextUnitOpen[index];
    }

    onScreenshotCollapseChange(index) {
        this.isScreenshotOpen[index] = !this.isScreenshotOpen[index];
    }

    textUnitForScreenshotUploadChanged(index) {
        this.textUnitSelectedForScreenshot[index.index0][index.index1] = !this.textUnitSelectedForScreenshot[index.index0][index.index1];
    }

    onImageChoose(image) {
        this.images[image.index] = image.imageInfo;
    }

    uploadScreenshotImage(index) {
        this.getInstance().performUploadScreenshot(index);
    }

    uploadScreenshotImageSuccess(screenshots) {
        // TODO: save screenshots
    }

    uploadScreenshotImageError() {
        // TODO: show upload failure
    }
}

export default alt.createStore(DashboardStore, "DashboardStore")
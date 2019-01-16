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
        this.uploadingIndex = -1;
        this.images = [];
        this.screenshotUploaded = [];
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
        this.uploadingIndex = index;
        this.getInstance().performUploadScreenshotImage(index);
    }

    uploadScreenshotImageSuccess() {
        // TODO: set imageUrl to this.images[this.uploadingIndex]
        this.getInstance().performUploadScreenshot();
        this.images[this.uploadingIndex] = '/api/images/testing'
    }

    uploadScreenshotImageError() {
        // TODO: show upload failure
        this.resetCheckMark();
        this.uploadingIndex = -1;
    }

    uploadScreenshotSuccess() {
        for(let i = 0; i < this.textUnitSelectedForScreenshot[this.uploadingIndex].length; i++) {
            if(this.textUnitSelectedForScreenshot[this.uploadingIndex][i]) {
                this.screenshotUploaded[this.uploadingIndex][i] = true;
            }
        }
        this.resetCheckMark();
        this.uploadingIndex = -1;
    }

    uploadScreenshotError() {
        // TODO: show upload failure
        this.resetCheckMark();
        this.uploadingIndex = -1;
    }

    resetCheckMark() {
        this.textUnitSelectedForScreenshot[this.uploadingIndex].fill(false);
    }
}

export default alt.createStore(DashboardStore, "DashboardStore")
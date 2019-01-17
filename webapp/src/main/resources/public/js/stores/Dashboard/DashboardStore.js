import alt from "../../alt";
import DashboardDataSource from "../../actions/dashboard/DashboardDataSource";
import DashboardSearchParamStore from "./DashboardSearchParamStore";
import DashboardPageActions from "../../actions/dashboard/DashboardPageActions";

class DashboardStore {
    constructor() {
        /**
         *
         * @type {branchStatistics[]}
         */
        this.setDefaultState();

        this.bindActions(DashboardPageActions);
        this.registerAsync(DashboardDataSource);

    }

    setDefaultState() {
        this.hasNext= false;
        this.hasPrevious= false;
        this.size = 0;
        this.currentPageNumber = 0;
        this.first = true;
        this.numberOfElements = 0;
        this.totalPages = 1;
        this.totalElements = 0;
        this.last = true;
        this.branchStatistics = [];
        this.searching = false;
        this.showScreenshotUploadModal = false;
        this.image = null;
        this.screenshotUploaded = [];
        this.textUnitChecked = [];
        this.isBranchOpen = [];
        this.numberOfTextUnitChecked = 0;
        this.totalTextUnitsInPage = 0;
    }

    getBranches() {
        this.waitFor(DashboardSearchParamStore);
        this.getInstance().performDashboardSearch();
        this.isSearching = true;

    }

    getBranchesSuccess(branchStatistics) {
        this.branchStatistics = branchStatistics;
        this.isSearching = false;
        this.images = Array.apply(null, Array(branchStatistics.length)).map(function () {
            return null;
        });
        this.isBranchOpen = Array.apply(null, Array(branchStatistics.length)).map(function () {
            return false;
        });
        this.totalTextUnitsInPage = 0;
        for (let i = 0; i < branchStatistics.length; i++) {
            //TODO: update screenshot data
            this.textUnitChecked.push(Array.apply(null, Array(branchStatistics[i].branchTextUnitStatistics.length)).map(function () {
                return false
            }));
            this.totalTextUnitsInPage += branchStatistics[i].branchTextUnitStatistics.length;
        }


    }

    onScreenshotUploadModalOpen() {
        this.showScreenshotUploadModal = true;
    }

    onScreenshotUploadModalClose() {
        this.showScreenshotUploadModal = false;
    }

    onBranchCollapseChange(index) {
        this.isBranchOpen[index] = !this.isBranchOpen[index];
    }

    textUnitCheckboxChanged(index) {
        this.textUnitChecked[index.index0][index.index1] = !this.textUnitChecked[index.index0][index.index1];
        this.numberOfTextUnitChecked +=  this.textUnitChecked[index.index0][index.index1] ? 1 : -1;
    }

    onImageChoose(image) {
        this.images[image.index] = image.imageInfo;
    }

    uploadScreenshotImage() {
        this.getInstance().performUploadScreenshotImage();
    }

    uploadScreenshotImageSuccess() {
        // TODO: set imageUrl to this.images[this.uploadingIndex]
        this.getInstance().performUploadScreenshot();
        this.image.url = '/api/images/testing'
    }

    uploadScreenshotImageError() {
        // TODO: show upload failure
        this.resetAllSelectedTextUnitsInCurrentPage();
    }

    uploadScreenshotSuccess() {

    }

    uploadScreenshotError() {
        // TODO: show upload failure
        this.resetAllSelectedTextUnitsInCurrentPage();
    }

    selectAllTextUnitsInCurrentPage() {
        this.textUnitChecked.forEach(e => e.fill(true));
        this.numberOfTextUnitChecked = this.totalTextUnitsInPage;
    }

    resetAllSelectedTextUnitsInCurrentPage() {
        this.textUnitChecked.forEach(e => e.fill(false));
        this.numberOfTextUnitChecked = 0;
    }

    fetchPreviousPage() {
        if(this.currentPageNumber > 0) {
            currentPageNumber--;
            this.getBranches();
        }
    }

    fetchNextPage() {
        if(this.currentPageNumber < this.totalPages) {
            currentPageNumber++;
            this.getBranches();
        }
    }
}

export default alt.createStore(DashboardStore, "DashboardStore")
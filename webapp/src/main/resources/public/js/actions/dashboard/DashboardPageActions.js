import alt from "../../alt";

class DashboardPageActions {

    constructor() {
        this.generateActions(
            "updateSearchParams",
            "getBranches",
            "getBranchesSuccess",
            "getBranchesError",
            "uploadScreenshotImage",
            "uploadScreenshotImageSuccess",
            "uploadScreenshotImageError",
            "textUnitForScreenshotUploadChanged",
            "onTextunitCollapseChange",
            "onScreenshotCollapseChange",
            "onImageChoose"
        );
    }
}

export default alt.createActions(DashboardPageActions);
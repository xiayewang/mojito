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
            "uploadScreenshot",
            "uploadScreenshotSuccess",
            "uploadScreenshotError",
            "textUnitForScreenshotUploadChanged",
            "onTextunitCollapseChange",
            "onScreenshotCollapseChange",
            "onImageChoose"
        );
    }
}

export default alt.createActions(DashboardPageActions);
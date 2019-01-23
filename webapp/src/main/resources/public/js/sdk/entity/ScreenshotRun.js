
import Screenshot from './Screenshot'

export default class ScreenshotRun {
    constructor() {
        this.id = null;
        this.screenshots = [];
    }

    static branchStatisticsToScreenshotRun(branchStatisticsContent, image, textUnitChecked) {
        let result = new ScreenshotRun();

        //TODO: 1) add repository to branchStatistics 2) add locale to UI

        result.id = branchStatisticsContent.branch.repository.manualScreenshotRun.id;
        result.screenshots.push(Screenshot.branchStatisticsContentToScreenshot(branchStatisticsContent, image, textUnitChecked));


        return result;

    }
}
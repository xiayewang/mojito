
import Screenshot from './Screenshot'

export default class ScreenshotRun {
    constructor() {
        this.repository = null;
        this.name = null;
        this.screenshots = null;
    }

    static branchStatisticsToScreenshotRun(branchStatistics, image) {
        let result = new ScreenshotRun();

        //TODO: 1) add repository to branchStatistics 2) add locale to UI

        result.name = branchStatistics.branch.name;
        result.screenshots = Screenshot.branchStatisticsToScreenshot(branchStatistics, image, 'zh_CN');

        return result;

    }
}
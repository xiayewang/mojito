export default class Screenshot {
    constructor() {
        this.name = null;
        this.locale = null;
        this.src = null;
        this.sequence = null;
        this.takenDate = null;
        this.screenshotTextUnits = null;
    }

    static branchStatisticsToScreenshot(branchStatistics, image, locale) {
        let result = new Screenshot();

        result.name = image.file.name;
        result.locale = locale;
        result.src = image.url;


        return result;
    }

}
import Branch from "./Branch"
import branchTextUnitStatistics from "./BranchTextUnitStatistics"

export default class BranchStatistics {
    constructor() {

        /**
         *
         * @type {BigInt}
         */
        this.id = null;

        /**
         *
         * @type {Branch}
         */
        this.branch = null;

        /**
         *
         * @type {BranchStatistics[]}
         */
        this.branchTextUnitStatistics = [];

        /**
         *
         * @type {BigInt}
         */
        this.forTranslationCount = null;

        /**
         *
         * @type {BigInt}
         */
        this.totalCount = null;

    }

    static toBranchStatistics(json) {
        let result = new BranchStatistics();

        result.id = json.id;
        result.branch = Branch.toBranh(json.branch);
        result.branchTextUnitStatistics = BranchStatistics.toBranchTextUnitStatisticsList(json.branchTextUnitStatistics);

        let forTranslationCount = 0;
        let totalCount = 0;

        result.branchTextUnitStatistics.forEach(function (element) {
            forTranslationCount += element.forTranslationCount;
            totalCount += element.totalCount;
        });

        result.forTranslationCount = forTranslationCount;
        result.totalCount = totalCount;


        return result;
    }
}
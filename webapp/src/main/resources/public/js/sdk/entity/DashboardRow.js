export default class DashboardRow {
    constructor() {

        /**
         *
         * @type {String}
         */
        this.branch = null;

        /**
         *
         * @type {String[]}
         */
        this.textUnits = null

    }

    static toRepository(json) {
        let result = new Repository();

        result.assetIntegrityCheckers = json.branch;
        result.textUnits = json.textUnits;

        return result;
    }

    /**
     * @param {Object[]} jsons
     * @return {Repository[]}
     */
    static toRepositorys(jsons) {
        let results = [];

        for (let json of jsons) {
            results.push(Repository.toRepository(json));
        }

        return results;
    }
}
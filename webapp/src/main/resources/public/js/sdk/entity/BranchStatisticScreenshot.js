import TmTextUnit from "./TmTextUnit";

export default class BranchStatisticScreenshot {
    constructor() {

        /** @type {Number} */
        this.id = null;

        this.textUnits = [];

    }

    /**
     * Convert JSON User object
     *
     * @param {Object} json
     * @return {Repository}
     */
    static toBranchStatisticScreenshot(json) {
        let result = new BranchStatisticScreenshot();
        if(json) {
            result.id = json.id;
            result.textUnits = TextUnit.toTextUnits(json.textUnits);
        }


        return result;
    }
}

class TextUnit {

    constructor() {
        this.id = null;
        this.tmTextUnit = null;
    }

    static toTextUnit(json) {
        let result = TextUnit();
        if(json) {
            result.id = json.id;
            result.tmTextUnit = TmTextUnit.toTmTextUnit(json.tmTextUnit);
        }

        return result;
    }

    static toTextUnits(jsons) {
        let result = [];

        if(jsons && jsons.length > 0) {
            for(let json of jsons) {
                result.push(TextUnit.toTextUnit(json));
            }
        }

        return result;
    }


}
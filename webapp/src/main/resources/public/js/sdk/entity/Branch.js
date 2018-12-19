import User from "./User"

export default class Branch {
    constructor() {
        /**
         *
         * @type {number}
         */
        this.id = null;
        /**
         *
         * @type {String}
         */
        this.name = null;

        /**
         *
         * @type {User}
         */
        this.createdByUser = null;

        /**
         *
         * @type {Boolean}
         */
        this.deleted = null;

    }

    static toBranh(json) {
        let result = new Branch();

        result.id = json.id;
        result.name = json.name;
        result.createdByUser = User.toUser(json.createdByUser);
        result.deleted = json.deleted;

        return result;
    }
}
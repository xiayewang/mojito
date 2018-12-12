export default
class BranchSearcherParameters {
    constructor() {
        this.params = {};
    }

    username(username) {
        this.params.username = username;
        return this;
    }

    branchName(branchName) {
        this.params.branchName = branchName;
        return this;
    }

    getParams(){
        return this.params;
    }
}
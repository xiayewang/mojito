export default
class DashboardSearcherParameters {
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

    deleted(deleted) {
        this.params.deleted = deleted;
    }

    undeleted(undeleted) {
        this.params.undeleted = undeleted;
    }

    getParams(){
        return this.params;
    }

    static isReadyForDashboardSearching(dashboardSearcherParams) {
        return dashboardSearcherParams.params.branchName || dashboardSearcherParams.params.username;
    }
}
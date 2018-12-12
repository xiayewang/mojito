import BaseClient from "./BaseClient";

class DashboardClient extends BaseClient {

    getBranches(branchSearcherParameters) {
        return this.get(this.getUrl(), branchSearcherParameters.getParams());
    }

    getEntityName() {
        return 'branches';
    }
};

export default new DashboardClient();
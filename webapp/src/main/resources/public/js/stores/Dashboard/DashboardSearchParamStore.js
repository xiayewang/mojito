import DashboardActions from "../../actions/DashboardActions";
import SearchConstants from "../../utils/SearchConstants";
import alt from "../../alt";

class DashboardSearchParamStore {
    constructor() {
        this.changedParam = "";
        this.setDefaultParameters();
        this.bindActions(DashboardActions);
    }

    setDefaultParameters() {
        /**
         *
         * @type {String}
         */
        this.searchText = null;

        /**
         *
         * @type {boolean}
         */
        this.isMine = true;
        /**
         *
         * @type {Boolean}
         */
        this.deleted = null;

        /**
         *
         * @type {Boolean}
         */
        this.undeleted = null;
    }

    onSearchParamsChanged(paramData) {

        switch (paramData.changedParam) {
            case SearchConstants.SEARCHTEXT_CHANGED:

                this.setFirstPageAsCurrent();
                this.searchText = paramData.data.searchText;
                this.searchAttribute = paramData.data.searchAttribute;
                this.searchType = paramData.data.searchType;
                break;

            case SearchConstants.SEARCHFILTER_CHANGED:

                this.setFirstPageAsCurrent();
                this[paramData.searchFilterParam] = paramData.searchFilterParamValue;
                break;

            case SearchConstants.UPDATE_ALL:

                this.setDefaultParameters();
                this.updateAllParameters(paramData);
                break;

            case SearchConstants.NEXT_PAGE_REQUESTED:

                this.incrementPageNumber();
                break;

            case SearchConstants.PREVIOUS_PAGE_REQUESTED:

                this.decrementPageNumber();
                break;

            default:
                console.error("SearchParamsStore::Unknown param type");
                break;
        }

        this.updatePageOffset();

        this.changedParam = paramData.changedParam;
    }
};

DashboardSearchParamStore.DELETED = {
    "YES": "YES",
    "NO": "NO",
};

export default alt.createStore(DashboardSearchParamStore, 'DashboardSearchParamStore');
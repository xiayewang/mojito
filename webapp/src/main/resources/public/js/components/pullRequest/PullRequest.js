import $ from "jquery";
import _ from "lodash";

import React from "react";
import { withRouter } from "react-router";
import {FormattedMessage, FormattedNumber} from 'react-intl';

import FluxyMixin from "alt-mixins/FluxyMixin";

import LocalesDropdown from "../workbench/LocalesDropdown";

import RepositoryActions from "../../actions/RepositoryActions";
import RepositoryDropDown from "../workbench/RepositoryDropdown";
import RepositoryStore from "../../stores/RepositoryStore";

import SearchResults from "../workbench/SearchResults";
import StatusDropdown from "../workbench/StatusDropdown";
import SearchText from "../workbench/SearchText";
import SearchParamsStore from "../../stores/workbench/SearchParamsStore";
import SearchConstants from "../../utils/SearchConstants";

import WorkbenchActions from "../../actions/workbench/WorkbenchActions";

import LocationHistory from "../../utils/LocationHistory";
import AltContainer from "alt-container";
import GitBlameStore from "../../stores/workbench/GitBlameStore";
import GitBlameActions from "../../actions/workbench/GitBlameActions.js";
import GitBlameInfoModal from "../workbench/GitBlameInfoModal";

import PullRequestSearchText from "./PullRequestSearchText";


let PullRequest = React.createClass({

    mixins: [FluxyMixin],

    statics: {
        storeListeners: {
            "onSearchParamsStoreChanged": SearchParamsStore,
            "onGitBlameStoreUpdated": GitBlameStore
        }
    },

    /**
     * Handler for SearchParamsStore changes
     *
     * @param {object} searchParams The SearchParamsStore state
     */
    onSearchParamsStoreChanged: function (searchParams) {
        this.updateLocationForSearchParam(searchParams);
    },

    onGitBlameStoreUpdated(store) {
        this.setState({"isShowGitBlameModal": store.show});
    },

    /**
     * Updates the browser location based to reflect search
     *
     * If the URL is only workbench replace the state (to reflect the search param) else if the query has changed
     * push a new state to keep track of the change param modification.
     *
     * @param {object} searchParams The SearchParamsStore state
     */
    updateLocationForSearchParam(searchParams) {
        LocationHistory.updateLocation(this.props.router, "/pull-requests", searchParams);
    },

    /**
     * @param {string} queryString Starts with ?
     * @return boolean
     */
    isCurrentQueryEqual: function (queryString) {
        return queryString === window.location.search;
    },

    /**
     * Create query string given SearchParams
     *
     * @param searchParams
     * @return {*}
     */
    buildQuery: function (searchParams) {
        let cloneParam = _.clone(searchParams);
        delete cloneParam["changedParam"];
        return $.param(cloneParam);
    },

    render: function () {
        return (
            <div>
                <div className="pull-left">
                    <RepositoryDropDown/>
                    <LocalesDropdown/>
                </div>

                <PullRequestSearchText/>
                <StatusDropdown/>

                <div className="mtl mbl">
                    <SearchResults/>
                </div>
                <AltContainer store={GitBlameStore}>
                    <GitBlameInfoModal onCloseModal={GitBlameActions.close}/>
                </AltContainer>

            </div>
        );
    }
});

export default withRouter(PullRequest);

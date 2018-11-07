import FluxyMixin from "alt-mixins/FluxyMixin";
import keycode from "keycode";
import React from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import {DropdownButton, FormGroup, FormControl, InputGroup, MenuItem, Button, Glyphicon} from "react-bootstrap";
import SearchParamsStore from "../../stores/workbench/SearchParamsStore";
import SearchConstants from "../../utils/SearchConstants";
import WorkbenchActions from "../../actions/workbench/WorkbenchActions";
import SearchResultsStore from "../../stores/workbench/SearchResultsStore";

let PullRequestSearchText = React.createClass({

    mixins: [FluxyMixin],

    statics: {
        storeListeners: {
            "onSearchParamsChanged": SearchParamsStore,
            "onSearchResultsStoreChanged": SearchResultsStore
        }
    },

    onSearchParamsChanged() {
        var searchParams = SearchParamsStore.getState();

        this.setState({
            "pullRequestSearchAttribute": searchParams.pullRequestSearchAttribute,
            "searchText": searchParams.searchText,
            "searchType": searchParams.searchType
        });
    },

    /**
     *
     */
    onSearchResultsStoreChanged() {
        this.setState({ "isSpinnerShown": SearchResultsStore.getState().isSearching });
    },

    /**
     *
     * @return {{searchAttribute: (*|string), searchType: (*|string), searchText: (*|string), isSpinnerShown: (*|boolean|Boolean)}}
     */
    getInitialState() {
        return {
            /** @type {string} */
            "pullRequestSearchAttribute": this.getInitialPullRequestSearchAttribute(),

            /** @type {string} */
            "searchType": this.getInitialSearchType(),

            /** @type {string} */
            "searchText": this.getInitialSearchText(),

            /** @type {Boolean} */
            "isSpinnerShown": SearchResultsStore.getState().isSearching
        };
    },

    /**
     * Get initial searchAttribute value
     *
     * @return {string}
     */
    getInitialPullRequestSearchAttribute() {
        return this.props.pullRequestSearchAttribute ? this.props.pullRequestSearchAttribute : SearchParamsStore.PULL_REQUEST_SEARCH_ATTRIBUTES.PULL_REQUEST_ID;
    },

    /**
     * Get initial searchText value
     *
     * @return {string}
     */
    getInitialSearchText() {
        return this.props.searchText ? this.props.searchText : null;
    },

    /**
     * Get initial searchType value
     *
     * @return {string}
     */
    getInitialSearchType() {
        return this.props.searchType ? this.props.searchType : SearchParamsStore.SEARCH_TYPES.EXACT;
    },

    onSearchAttributeSelected(pullRequestSearchAttribute) {

        if (pullRequestSearchAttribute !== this.state.pullRequestSearchAttribute) {
            this.setStateAndCallSearchParamChanged({pullRequestSearchAttribute: pullRequestSearchAttribute});
        }
    },

    onSearchTypeSelected(searchType) {

        if (searchType !== this.state.searchType) {
            this.setStateAndCallSearchParamChanged({searchType: searchType});
        }
    },

    onKeyDownOnSearchText(e) {
        if (e.keyCode == keycode("enter")) {
            this.callSearchParamChanged();
        }
    },

    onSearchButtonClicked() {
        this.callSearchParamChanged();
    },

    setStateAndCallSearchParamChanged(state) {
        this.setState(state, function () {
            this.callSearchParamChanged();
        });
    },

    callSearchParamChanged() {
        let actionData = {
            "changedParam": SearchConstants.SEARCHTEXT_CHANGED,
            "data": this.state
        };

        WorkbenchActions.searchParamsChanged(actionData);
    },


    getMessageForSearchAttribute(pullRequestSearchAttribute) {
        switch (pullRequestSearchAttribute) {
            case SearchParamsStore.PULL_REQUEST_SEARCH_ATTRIBUTES.PULL_REQUEST_ID:
                return this.props.intl.formatMessage({id: "search.filter.pullRequestId"});
            case SearchParamsStore.PULL_REQUEST_SEARCH_ATTRIBUTES.AUTHOR_NAME:
                return this.props.intl.formatMessage({id: "search.filter.authorName"});
        }
    },

    getMessageForSearchType(searchType) {
        switch (searchType) {
            case SearchParamsStore.SEARCH_TYPES.EXACT:
                return this.props.intl.formatMessage({id: "search.filter.exact"});
            case SearchParamsStore.SEARCH_TYPES.CONTAINS:
                return this.props.intl.formatMessage({id: "search.filter.contains"});
            case SearchParamsStore.SEARCH_TYPES.ILIKE:
                return this.props.intl.formatMessage({id: "search.filter.ilike"});
        }
    },

    renderSearchAttributeMenuItem(pullRequestSearchAttribute) {
        return (
            <MenuItem eventKey={pullRequestSearchAttribute} active={this.state.pullRequestSearchAttribute === pullRequestSearchAttribute}
        onSelect={this.onSearchAttributeSelected}>
        {this.getMessageForSearchAttribute(pullRequestSearchAttribute)}
    </MenuItem>
    );
    },

    renderSearchTypeMenuItem(searchType) {
        return (
            <MenuItem eventKey={searchType} active={this.state.searchType === searchType }
        onSelect={this.onSearchTypeSelected}>
        {this.getMessageForSearchType(searchType)}
    </MenuItem>
    );
    },

    renderDropdown() {
        return (
            <DropdownButton id="pull-request-search-attribute-dropdown"
                            title={this.getMessageForSearchAttribute(this.state.pullRequestSearchAttribute)}>
                <MenuItem header><FormattedMessage id="search.filter.pullRequestSearchAttribute"/></MenuItem>
                {this.renderSearchAttributeMenuItem(SearchParamsStore.PULL_REQUEST_SEARCH_ATTRIBUTES.PULL_REQUEST_ID)}
                {this.renderSearchAttributeMenuItem(SearchParamsStore.PULL_REQUEST_SEARCH_ATTRIBUTES.AUTHOR_NAME)}
                <MenuItem divider/>
                <MenuItem header><FormattedMessage id="search.filter.searchType"/></MenuItem>
                {this.renderSearchTypeMenuItem(SearchParamsStore.SEARCH_TYPES.EXACT)}
                {this.renderSearchTypeMenuItem(SearchParamsStore.SEARCH_TYPES.CONTAINS)}
                {this.renderSearchTypeMenuItem(SearchParamsStore.SEARCH_TYPES.ILIKE)}
            </DropdownButton>
        );
    },

    renderSearchButton() {
        return (
            <Button onClick={this.onSearchButtonClicked}>
    <Glyphicon glyph='glyphicon glyphicon-search'/>
            </Button>
    );
    },

    /**
     *
     * @param {SyntheticEvent} event
     */
    searchTextOnChange(event) {
        this.setState({
            "searchText": event.target.value
        });
    },

    render: function () {
        return (
            <div className="col-xs-6 search-text">
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Button>{this.renderDropdown()}</InputGroup.Button>
                        <FormControl type='text' value={this.state.searchText ? this.state.searchText : ""}
                                     onChange={this.searchTextOnChange}
                                     placeholder={this.props.intl.formatMessage({id: "search.placeholder"})}
                                     onKeyDown={this.onKeyDownOnSearchText}/>
                        <InputGroup>
                            {this.state.isSpinnerShown ? (
                                <span className="glyphicon glyphicon-refresh spinning"/>) : ""}
                        </InputGroup>
                        <InputGroup.Button>{this.renderSearchButton()}</InputGroup.Button>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }
});

export default injectIntl(PullRequestSearchText);

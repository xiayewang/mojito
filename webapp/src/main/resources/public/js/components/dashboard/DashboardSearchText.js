import FluxyMixin from "alt-mixins/FluxyMixin";
import keycode from "keycode";
import React from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import {DropdownButton, FormGroup, FormControl, InputGroup, MenuItem, Button, Glyphicon} from "react-bootstrap";
import SearchParamsStore from "../../stores/workbench/SearchParamsStore";
import SearchConstants from "../../utils/SearchConstants";
import WorkbenchActions from "../../actions/workbench/WorkbenchActions";
import SearchResultsStore from "../../stores/workbench/SearchResultsStore";
import DashboardSearchParamStore from "../../stores/Dashboard/DashboardSearchParamStore";
import DashboardActions from "../../actions/DashboardActions";

let DashboardSearchText = React.createClass({

    mixins: [FluxyMixin],

    statics: {
        storeListeners: {
            "onSearchParamsChanged": DashboardSearchParamStore,
            "onSearchResultsStoreChanged": SearchResultsStore
        }
    },

    onSearchParamsChanged() {
        var searchParams = DashboardSearchParamStore.getState();

        this.setState({
            "searchText": searchParams.searchText
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
            "searchText": this.getInitialSearchText(),

            /** @type {Boolean} */
            "isSpinnerShown": SearchResultsStore.getState().isSearching
        };
    },

    /**
     * Get initial searchText value
     *
     * @return {string}
     */
    getInitialSearchText() {
        return this.props.searchText ? this.props.searchText : null;
    },

    onKeyDownOnSearchText(e) {
        if (e.keyCode == keycode("enter")) {
            this.callSearchParamChanged();
        }
    },

    onSearchButtonClicked() {
        this.callSearchParamChanged();
    },

    callSearchParamChanged() {
        let actionData = {
            "changedParam": SearchConstants.SEARCHTEXT_CHANGED,
            "data": this.state
        };

        DashboardActions.getBranches();
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

export default injectIntl(DashboardSearchText);

import React from "react";
import {FormattedMessage, injectIntl} from 'react-intl';
import {DropdownButton, MenuItem} from "react-bootstrap";
import FluxyMixin from "alt-mixins/FluxyMixin";

import SearchParamsStore from "../../stores/workbench/SearchParamsStore";
import SearchConstants from "../../utils/SearchConstants";
import DashboardActions from "../../actions/DashboardActions";
import DashboardStore from "../../stores/Dashboard/DashboardStore";
import DashboardSearchParamStore from "../../stores/Dashboard/DashboardSearchParamStore";

let DashboardStatusDropdown = React.createClass({

    mixins: [FluxyMixin],

    statics: {
        storeListeners: {
            "getBranches": DashboardStore
        }
    },

    getInitialState() {
        return {
            "isMine" : true,
            "deleted" : true,
            "undeleted": true
        };
    },

    onSearchParamsChanged() {

        var searchParams = DashboardSearchParamStore.getState();

        this.setState({
            "isMine": searchParams.isMine,
            "deleted": searchParams.deleted,
            "undeleted": searchParams.undeleted
        });
    },

    /**
     * When a filter is selected, update the search params
     *
     * @param filter selected filter
     */
    onFilterSelected(filter) {

        let newFilterValue = !this.state[filter];

        let actionData = {
            "changedParam": SearchConstants.SEARCHFILTER_CHANGED,
            "searchFilterParam": filter,
            "searchFilterParamValue": newFilterValue
        };

        //DashboardActions.getbranches(actionData);
        DashboardActions.getbranches();
    },

    /**
     * Renders the filter menu item.
     *
     * @param filter
     * @param isYes
     * @returns {XML}
     */
    renderFilterMenuItem(filter, isYes) {

        let msg = isYes ? this.props.intl.formatMessage({ id: "search.statusDropdown.yes" }) : this.props.intl.formatMessage({ id: "search.statusDropdown.no" });

        return (
            <MenuItem eventKey={filter} active={this.state[filter]} onSelect={this.onFilterSelected} >{msg}</MenuItem>
        );
    },


    render() {

        return (

            <DropdownButton
                id="DashboardStatusDropdown"
                title={this.props.intl.formatMessage({id: "search.statusDropdown.title"})}
            >

                <MenuItem header><FormattedMessage id="search.statusDropdown.deleted"/></MenuItem>
                {this.renderFilterMenuItem("deleted", true)}
                {this.renderFilterMenuItem("undeleted", true)}
                <MenuItem divider/>

            </DropdownButton>
        );
    }
});


export default injectIntl(DashboardStatusDropdown);

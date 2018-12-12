

import React from "react";
import { withRouter } from "react-router";

import FluxyMixin from "alt-mixins/FluxyMixin";

import {Table} from "react-bootstrap";
import RepositoryHeaderColumn from "../repositories/RepositoryHeaderColumn";
import DashboardSearchResults from "./DashboardSearchResults";
import DashboardStore from "../../stores/Dashboard/DashboardStore";
import DashboardSearchText from "./DashboardSearchText";
import DashboardStatusDropdown from "./DashboardStatusDropdown";


let Dashboard = React.createClass({

    mixins: [FluxyMixin],

    statics: {
        storeListeners: {
            "onDashboardStoreChanged": DashboardStore
        }
    },

    getInitialState: function () {

        return this.state;
    },

    onDashboardStoreChanged: function() {
        this.setState(DashboardStore.getState());
    },

    getTableRow: function (rowData) {
        let branch = rowData.branch;

        return (
            <DashboardSearchResults key={branch} rowData={rowData}
                           ref={"DashboardRow" + branch}/>
        );
    },

    render: function () {

        return (
            <div>
                <DashboardSearchText/>
                <DashboardStatusDropdown/>
                <div className="plx prx">
                    <Table className="repo-table table-padded-sides">
                        <thead>
                        <tr>
                            <RepositoryHeaderColumn className="col-md-3"
                                                    columnNameMessageId="repositories.table.header.name"/>
                            <RepositoryHeaderColumn className="col-md-2"/>
                            <RepositoryHeaderColumn className="col-md-3"
                                                    columnNameMessageId="repositories.table.header.needsTranslation"/>
                            <RepositoryHeaderColumn className="col-md-3"
                                                    columnNameMessageId="repositories.table.header.needsReview"/>
                            <RepositoryHeaderColumn className="col-md-1"/>
                        </tr>
                        </thead>
                    </Table>
                </div>
            </div>
        );
    }
});

export default withRouter(Dashboard);

import React from "react";
import PropTypes from 'prop-types';
import FluxyMixin from "alt-mixins/FluxyMixin";
import {injectIntl} from "react-intl";
import {Table} from "react-bootstrap";
import RepositoryHeaderColumn from "../repositories/RepositoryHeaderColumn";
import DashboardStore from "../../stores/Dashboard/DashboardStore";
import DashboardRow from "./DashboardRow";

class DashboardSearchResults extends React.Component{

    static propTypes = {
        "dashboardRows": PropTypes.array
    }

    getTableRow(rowData) {
        return (
            <DashboardRow key={rowData.branch.id} rowData={rowData} ref={"dashboardRow" + rowData.branch.id}/>
        )
    }

    render() {

        return (
            <div className="plx prx">
                <Table className="repo-table table-padded-sides">
                    <thead>
                    <tr>
                        <RepositoryHeaderColumn className="col-md-3"
                                                columnNameMessageId="repositories.table.header.name"/>
                        <RepositoryHeaderColumn className="col-md-3"
                                                columnNameMessageId="repositories.table.header.needsTranslation"/>
                        <RepositoryHeaderColumn className="col-md-3"
                                                columnNameMessageId="dashboard.table.header.screenshot"/>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.dashboardRows.map(this.getTableRow)}
                    </tbody>
                </Table>
            </div>
        );
    }

};

export default injectIntl(DashboardSearchResults);
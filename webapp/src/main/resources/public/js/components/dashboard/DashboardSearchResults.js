import React from "react";
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import {Table} from "react-bootstrap";
import RepositoryHeaderColumn from "../repositories/RepositoryHeaderColumn";
import DashboardRow from "./DashboardRow";

class DashboardSearchResults extends React.Component {

    static propTypes = {
        "dashboardRows": PropTypes.array.isRequired,
        "isTextUnitOpen": PropTypes.array.isRequired,
        "isScreenshotOpen": PropTypes.array.isRequired,
        "textUnitSelectedForScreenshot": PropTypes.array.isRequired,
        "onUploadImageClick": PropTypes.func.isRequired,
        "onTextUnitForScreenshotUploadClick": PropTypes.func.isRequired,
        "onTextunitCollapseClick": PropTypes.func.isRequired,
        "onScreenshotCollapseClick": PropTypes.func.isRequired,
        "onChooseImageClick": PropTypes.func.isRequired,
    };

    getTableRows() {
        let dashboardRows = [];
        for (let i = 0; i < this.props.dashboardRows.length; i++) {
            dashboardRows.push(
                <DashboardRow
                    dashboardRow={this.props.dashboardRows[i]}
                    isTextUnitOpen={this.props.isTextUnitOpen[i]}
                    isScreenshotOpen={this.props.isScreenshotOpen[i]}
                    textUnitSelectedForScreenshot={this.props.textUnitSelectedForScreenshot[i]}
                    onUploadImageClick={
                        () => {
                            this.props.onUploadImageClick(i)
                        }
                    }
                    onTextUnitForScreenshotUploadClick={
                        (index) => {
                            this.props.onTextUnitForScreenshotUploadClick({index0: i, index1: index})
                        }
                    }
                    onTextunitCollapseClick={
                        () => {
                            this.props.onTextunitCollapseClick(i)
                        }
                    }
                    onScreenshotCollapseClick={
                        () => {
                            this.props.onScreenshotCollapseClick(i)
                        }
                    }
                    onChooseImageClick={
                        (image) => {
                            this.props.onChooseImageClick({index: i, imageInfo: image})
                        }
                    }
                />
            )
        }
        return dashboardRows;
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
                    {this.getTableRows()}
                    </tbody>
                </Table>
            </div>
        );
    }

}

export default injectIntl(DashboardSearchResults);
import React from "react";
import {Button, Collapse, Glyphicon, Grid, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link} from "react-router";
import {FormattedMessage, FormattedNumber} from "react-intl";
import WorkbenchActions from "../../actions/workbench/WorkbenchActions";
import SearchConstants from "../../utils/SearchConstants";
import ImageUpload from "./ImageUpload"
import PropTypes from "prop-types";
import BranchStatistics from "../../sdk/entity/BranchStatistics"


class DashboardRow extends React.Component {
    static propTypes = {
        "dashboardRow": PropTypes.any.isRequired,
        // "dashboardRow": PropTypes.instanceOf(BranchStatistics).isRequired,
        "isTextUnitOpen": PropTypes.bool.isRequired,
        "isScreenshotOpen": PropTypes.bool.isRequired,
        "textUnitSelectedForScreenshot": PropTypes.array.isRequired,
        "onUploadImageClick": PropTypes.func.isRequired,
        "onTextUnitForScreenshotUploadClick": PropTypes.func.isRequired,
        "onTextunitCollapseClick": PropTypes.func.isRequired,
        "onScreenshotCollapseClick": PropTypes.func.isRequired,
        "onChooseImageClick": PropTypes.func.isRequired
    };

    /**
     * Update the Workbench search params to load the translation view for the selected repo
     *
     * @param {number} repoId
     */
    updateSearchParamsForNeedsTranslation(branchId) {

        WorkbenchActions.searchParamsChanged({
            "changedParam": SearchConstants.UPDATE_ALL,
            "branchId": branchId
        });
    }

    updateScreenshotSearchParams(branchId) {
        //TODO add branchId to screenshot search params
        // ScreenshotsSearchTextActions.changeSearchText(
        //     {
        //
        //     }
        //);
    }

    createTextUnitsCollapsible() {
        let branchName = this.props.dashboardRow.branch.name;
        let texts = [];
        this.props.dashboardRow.branchTextUnitStatistics.forEach(function (element) {
            texts.push(<p>{element.tmTextUnit.content}</p>);
        });

        return (
            <div>
                <Button onClick={() => this.props.onTextunitCollapseClick()}>
                    {branchName}
                </Button>
                <Collapse in={this.props.isTextUnitOpen}>
                    <div>
                        {texts}
                    </div>
                </Collapse>
            </div>

        );
    }

    getNeedsTranslationLabel() {

        let translationLabel = "";

        let textUnits = this.props.dashboardRow.branchTextUnitStatistics.length;

        if (textUnits > 0) {

            let forTranslationCount = textUnits> 1 ? this.props.dashboardRow.branchTextUnitStatistics.reduce((a, b) => a.forTranslationCount + b.forTranslationCount)
                                                    : this.props.dashboardRow.branchTextUnitStatistics[0].forTranslationCount;
            let totalCount = textUnits> 1 ? this.props.dashboardRow.branchTextUnitStatistics.reduce((a, b) => a.totalCount + b.totalCount)
                                          : this.props.dashboardRow.branchTextUnitStatistics[0].totalCount;
            translationLabel = (
                <Link onClick={this.updateSearchParamsForNeedsTranslation.bind(this, this.props.dashboardRow.branch.id)} to='/workbench'>
                    <span className="branch-counts"><FormattedNumber value={forTranslationCount}/>&nbsp;</span>
                    (&nbsp;<FormattedMessage values={{numberOfWords: totalCount}} id="repositories.table.row.numberOfWords"/>&nbsp;)
                </Link>);
        }

        return translationLabel;
    }

    getScreenshotLabel() {
        let numberOfScreenshot = 1;
        let numberOfTotalScreenshots = 2;
        return (
            <Link onClick={this.updateScreenshotSearchParams.bind(this, this.props.dashboardRow.branch.id)} to='/screenshots'>
                <span className="branch-counts"><FormattedNumber value={numberOfScreenshot}/>&nbsp;</span>
                (&nbsp;<FormattedMessage values={{numberOfScreenshots: numberOfTotalScreenshots}} id="dashboard.table.row.numberOfScreenshots"/>&nbsp;)
            </Link>
        );
    }


    getAddScreenshotButton() {
        let uploadImageForTextunits = [];

        for (let index = 0; index < this.props.dashboardRow.branchTextUnitStatistics.length; index ++) {
            uploadImageForTextunits.push(
                <div>
                    <input
                        type="checkbox"
                        title={this.props.dashboardRow.branchTextUnitStatistics[index].tmTextUnit.content}
                        checked={this.props.textUnitSelectedForScreenshot[index]}
                        onChange={() => this.props.onTextUnitForScreenshotUploadClick(index)}/>
                    <em>{this.props.dashboardRow.branchTextUnitStatistics[index].tmTextUnit.content}</em>
                </div>

            )
        }

        return (
            <div>
                <Button onClick={() => this.props.onScreenshotCollapseClick()}>
                    Upload Screenshot
                </Button>
                <Collapse in={this.props.isScreenshotOpen}>
                    <div>
                        {uploadImageForTextunits}

                        <Button onClick={() => this.props.onUploadImageClick()}>
                            Submit
                        </Button>
                    </div>
                </Collapse>
            </div>

        );
    }

    render() {

      // return (
      //     <tr className={"row-active"}>
      //         <td>{this.createTextUnitsCollapsible()}</td>
      //         <td>{this.getNeedsTranslationLabel()}</td>
      //         <td>{this.getScreenshotLabel()}</td>
      //         <td>{this.getAddScreenshotButton()}</td>
      //     </tr>
      // )
        return (
            <tr className={"row-active"}>
                <td>{this.createTextUnitsCollapsible()}</td>
                <td>{this.getNeedsTranslationLabel()}</td>
                <td>{this.getScreenshotLabel()}</td>
                <td>{this.getAddScreenshotButton()}</td>
            </tr>
        )
    }

}

export default DashboardRow;
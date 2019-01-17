import React from "react";
import {Button, Collapse, Col, Glyphicon, Grid, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {Link} from "react-router";
import {FormattedMessage, FormattedNumber} from "react-intl";
import WorkbenchActions from "../../actions/workbench/WorkbenchActions";
import SearchConstants from "../../utils/SearchConstants";
import PropTypes from "prop-types";


class BranchStatistic extends React.Component {
    static propTypes = {
        "branchStatistic": PropTypes.any.isRequired,
        "isBranchOpen": PropTypes.bool.isRequired,
        "textUnitChecked": PropTypes.array.isRequired,
        "onUploadImageClick": PropTypes.func.isRequired,
        "onTextUnitForScreenshotUploadClick": PropTypes.func.isRequired,
        "onBranchCollapseClick": PropTypes.func.isRequired,
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

    createTextUnitsCollapsible(branchTextUnitStatistic, arrayIndex) {
        return [
            <th>
                <input
                    type="checkbox"
                    checked={this.props.textUnitChecked[arrayIndex]}
                    onChange={() => this.props.onTextUnitForScreenshotUploadClick(arrayIndex)}/>
                <em>{branchTextUnitStatistic.tmTextUnit.content}</em>
            </th>,
            <th>
                {this.getNeedsTranslationLabel([branchTextUnitStatistic])}
            </th>
        ];
    }

    getNeedsTranslationLabel(branchTextUnitStatistics) {

        let translationLabel = "";

        let textUnits = branchTextUnitStatistics.length;

        if (textUnits > 0) {

            let forTranslationCount = textUnits > 1 ? branchTextUnitStatistics.reduce((a, b) => a.forTranslationCount + b.forTranslationCount)
                : branchTextUnitStatistics[0].forTranslationCount;
            let totalCount = textUnits > 1 ? branchTextUnitStatistics.reduce((a, b) => a.totalCount + b.totalCount)
                : branchTextUnitStatistics[0].totalCount;
            translationLabel = (
                <Link
                    onClick={this.updateSearchParamsForNeedsTranslation.bind(this, this.props.branchStatistic.branch.id)}
                    to='/workbench'>
                    <span className="branch-counts"><FormattedNumber value={forTranslationCount}/>&nbsp;</span>
                    (&nbsp;<FormattedMessage values={{numberOfWords: totalCount}}
                                             id="repositories.table.row.numberOfWords"/>&nbsp;)
                </Link>);
        }

        return translationLabel;
    }

    getScreenshotLabel(branchTextUnitStatistics) {
        let numberOfScreenshot = 1;
        let numberOfTotalScreenshots = 2;
        return (
            <Link onClick={this.updateScreenshotSearchParams.bind(this, this.props.branchStatistic.branch.id)}
                  to='/screenshots'>
                <span className="branch-counts"><FormattedNumber value={numberOfScreenshot}/>&nbsp;</span>
                (&nbsp;<FormattedMessage values={{numberOfScreenshots: numberOfTotalScreenshots}}
                                         id="dashboard.table.row.numberOfScreenshots"/>&nbsp;)
            </Link>
        );
    }


    render() {

        let result = [];
        result.push(
            <tr className={"row-active"}>
                <th>
                    <Button onClick={() => this.props.onBranchCollapseClick()}>
                        {this.props.branchStatistic.branch.name}
                    </Button>
                </th>
                <th>{this.getNeedsTranslationLabel(this.props.branchStatistic.branchTextUnitStatistics)}</th>
                <th>{this.getScreenshotLabel(this.props.branchStatistic.branchTextUnitStatistics)}</th>
            </tr>
        );
        result.push(
            <tr className={"row-active"}>
                <div>
                    <Collapse in={this.props.isBranchOpen}>
                        <tr>
                            {this.props.branchStatistic.branchTextUnitStatistics.map(this.createTextUnitsCollapsible.bind(this))}
                        </tr>
                    </Collapse>
                </div>
            </tr>
        );

        return (
            <thead>
                {result}
            </thead>
        );
    }

}

export default BranchStatistic;
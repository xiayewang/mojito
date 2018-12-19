import React from "react";
import {Button, Collapse, Glyphicon, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link} from "react-router";
import {FormattedMessage, FormattedNumber} from "react-intl";
import WorkbenchActions from "../../actions/workbench/WorkbenchActions";
import SearchConstants from "../../utils/SearchConstants";
import SearchParamsStore from "../../stores/workbench/SearchParamsStore";
import ScreenshotClient from "../../sdk/ScreenshotClient";
import ScreenshotActions from "../../actions/screenshots/ScreenshotActions";


let DashboardRow = React.createClass({
    getInitialState() {
        return {
            isOpen: false
        }
    },

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
    },

    updateScreenshotSearchParams(branchId) {
        //TODO add branchId to screenshot search params
        // ScreenshotsSearchTextActions.changeSearchText(
        //     {
        //
        //     }
        //);
    },

    createTextUnitsCollapsible() {
        let branchName = this.props.rowData.branch.name;
        let texts = [];
        this.props.rowData.branchTextUnitStatistics.forEach(function (element) {
            texts.push(<p>{element.tmTextUnit.content}</p>);
        });

        return (
            <div>
                <Button onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
                    {branchName}
                </Button>
                <Collapse in={this.state.isOpen}>
                    <div>
                        {texts}
                    </div>
                </Collapse>
            </div>

        );
    },

    getNeedsTranslationLabel() {

        let translationLabel = "";

        let forTranslationCount = this.props.rowData.forTranslationCount;
        let totalCount = this.props.rowData.totalCount;

        if (forTranslationCount > 0) {
            translationLabel = (
                <Link onClick={this.updateSearchParamsForNeedsTranslation.bind(this, this.props.rowData.branch.id)} to='/workbench'>
                    <span className="branch-counts"><FormattedNumber value={forTranslationCount}/>&nbsp;</span>
                    (&nbsp;<FormattedMessage values={{numberOfWords: totalCount}} id="repositories.table.row.numberOfWords"/>&nbsp;)
                </Link>);
        }

        return translationLabel;
    },

    getScreenshotLabel() {
        let numberOfScreenshot = 0;
        let numberOfTotalScreenshots = 0;
        return (
            <Link onClick={this.updateScreenshotSearchParams.bind(this, this.props.rowData.branch.id)} to='/screenshots'>
                <span className="branch-counts"><FormattedNumber value={numberOfScreenshot}/>&sol;<FormattedNumber value={numberOfTotalScreenshots}/></span>
            </Link>
        );
    },

    getAddScreenshotButton() {
        let screenshot;
        let descriptionTooltip = <Tooltip id = "add-screenshot-tooltip"> add screenshot</Tooltip>;
        return (
            <button>
                <Glyphicon glyph='glyphicon glyphicon-plus'/>
            </button>
        )
    },

    render() {

      return (
          <tr className={"row-active"}>
              <td>{this.createTextUnitsCollapsible()}</td>
              <td>{this.getNeedsTranslationLabel()}</td>
              <td>{this.getScreenshotLabel()}</td>
              <td>{this.getAddScreenshotButton()}</td>
          </tr>
      )
    }

});

export default DashboardRow;
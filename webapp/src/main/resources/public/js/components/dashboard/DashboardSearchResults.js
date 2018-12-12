import React from "react";
import FluxyMixin from "alt-mixins/FluxyMixin";
import {injectIntl} from "react-intl";

let DashboardSearchResults = React.createClass({

    mixins: [FluxyMixin],


    render() {
        const branch = this.props.rowData.branch;

        return (
            <tr className={rowClass}>

                <td>{branch}</td>
            </tr>
        );
    }

});

export default injectIntl(DashboardSearchResults);
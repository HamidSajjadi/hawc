import React from "react";
import PropTypes from "prop-types";
import {action, computed, toJS, observable} from "mobx";
import {observer} from "mobx-react";

import {NULL_CASE} from "../shared";

class DescriptiveTableStore {
    @observable rows = [];

    constructor(dp) {
        this.dp = dp;
        this.rows = dp.settings.description_settings;
    }

    @action.bound addRow() {
        this.rows.push({
            field_name: NULL_CASE,
            header_name: "",
            header_style: "header",
            text_style: "base",
            dpe: NULL_CASE,
            max_width: undefined,
        });
    }
    @action.bound deleteRow(index) {
        this.rows.splice(index, 1);
    }
    @action.bound moveUp(index) {
        if (index > 0) {
            this.rows.splice(index - 1, 0, this.rows.splice(index, 1)[0]);
        }
    }
    @action.bound moveDown(index) {
        if (index < this.rows.length - 1) {
            this.rows.splice(index + 1, 0, this.rows.splice(index, 1)[0]);
        }
    }
}

@observer
class DescriptiveTable extends React.Component {
    constructor(props) {
        super(props);
        this.store = new DescriptiveTableStore(props.dp);
    }
    render() {
        return (
            <>
                <h3>Descriptive text columns</h3>
                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>Column header</th>
                            <th>Display name</th>
                            <th>Header style</th>
                            <th>Text style</th>
                            <th>Maximum width (pixels)</th>
                            <th>On-click</th>
                            <th>
                                Actions
                                <button
                                    className="btn btn-primary btn-sm float-right"
                                    onClick={() => this.store.addRow()}>
                                    <i className="fa fa-plus"></i>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <colgroup>
                        <col></col>
                        <col></col>
                        <col></col>
                        <col></col>
                        <col width="120px"></col>
                        <col></col>
                        <col width="120px"></col>
                    </colgroup>
                    <tbody>
                        {this.store.rows.map((row, i) => {
                            return (
                                <tr key={i}>
                                    <td>{row.field_index}</td>
                                    <td>{row.field_name}</td>
                                    <td>{row.header_name}</td>
                                    <td>{row.text_style}</td>
                                    <td>{row.max_width}</td>
                                    <td>{row.dpe}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => this.store.moveUp(i)}>
                                            <i className="fa fa-arrow-up"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-info mx-1"
                                            onClick={() => this.store.moveDown(i)}>
                                            <i className="fa fa-arrow-down"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => this.store.deleteRow(i)}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>
        );
    }
}

DescriptiveTable.propTypes = {
    dp: PropTypes.object,
};
export default DescriptiveTable;

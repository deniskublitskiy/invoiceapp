import React, { Component } from 'react';

export default class EntityCreateMiniPage extends Component {

    state = {};

    onClose() {
        this.props.onClose();
    }

    onChange({target}) {
        let column = target.getAttribute('data-column');
        this.setState({
            [column]: target.value
        })
    }

    onSave() {
        this.props.onSave(this.state);
        this.onClose();
    }

    render() {
        let columns = this.props.columns.map((column, index) =>
            <div key={index}>
                <label htmlFor={`productMiniPageColumn${column.name}`}>{column.header}</label>
                <div className="input-group">
                    <input
                        type={column.type}
                        id={`productMiniPageColumn${column.name}`}
                        className="form-control"
                        value={this.state[column.name]}
                        data-column={column.name}
                        onChange={::this.onChange}
                    />
                    <span className="input-group-addon">
                        {column.addon || ""}
                    </span>
                </div>
            </div>
        );

        return <div className="modal">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">
                            {this.props.header}
                        </h4>
                    </div>
                    <div className="modal-body">
                        <div className="form-group page-content">
                            {columns}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={::this.onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={::this.onSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
};
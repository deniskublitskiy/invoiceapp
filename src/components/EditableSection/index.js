import React, { Component } from 'react';
import EntityCreateMiniPage from '../EntityCreateMiniPage/index';
import _ from 'lodash';

export default class EditableSection extends Component {

    state = {
        isCreateMiniPageOpen: false
    };

    editRecord(e, id) {
        if (this.props.current.id !== id) {
            this.props.editRecord(id);
        }
    }

    saveRow(id) {
        let current = this.props.current;
        if (current && current.isChanged) {
            this.props.saveEntity(id, current);
        }
    }

    deleteRow(id) {
        this.props.deleteEntity(id)
    }

    onRowChange({target}, entityId) {
        let column = target.getAttribute('data-column');
        let {value} = target;
        this.props.changeEntity(entityId, {
            [column]: value,
        })
    }

    get entities() {
        return this.props.entities.map((entity, index) => {
            if (this.props.current && this.props.current.id === entity.id) {
                let rows = this.props.columns.map((column, index) =>
                    <td key={index}>
                        <input
                            data-column={column.name}
                            type="text"
                            onChange={e => this.onRowChange(e, entity.id)}
                            value={this.props.current[column.name]}
                        />
                    </td>
                );
                return <tr key={index} onClick={e => this.editRecord(e, entity.id)}>
                    <td>{this.prepareColumnValue(entity.id)}</td>
                    {rows}
                    <td>
                        <button
                            className="btn btn-success"
                            disabled={!this.props.current.isChanged}
                            onClick={e => this.saveRow(entity.id)}
                        >
                            Save
                        </button>
                        <button
                            className="btn btn-danger"
                            style={{marginLeft: 10}}
                            onClick={e => this.deleteRow(entity.id)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            }

            let rows = this.props.columns.map((column, index) =>
                <td key={index}>{this.prepareColumnValue(entity[column.name])}</td>
            );

            return <tr key={index} onClick={e => this.editRecord(e, entity.id)}>
                <td>{this.prepareColumnValue(entity.id)}</td>
                {rows}
                <td/>
            </tr>
        });
    }

    noColumnDataCaption = 'No data';

    prepareColumnValue(value) {
        return (!value && value !== 0) ? this.noColumnDataCaption : value
    }

    openCreateMiniPage() {
        this.setIsCreateMiniPageOpen(true);
    }

    closeCreateMiniPage() {
        this.setIsCreateMiniPageOpen(false);
    }

    setIsCreateMiniPageOpen(value) {
        this.setState({
            isCreateMiniPageOpen: value
        })
    }

    onCreateMiniSave(entity) {
        this.props.createEntity(entity);
    }

    render() {
        let headers = this.props.columns.map((column, index) =>
            <th key={index}>{column.header}</th>
        );

        return <div>
            <h3>{_.capitalize(this.props.header)}s</h3>
            <h6>Click row to edit</h6>
            <button
                className="btn btn-success"
                onClick={::this.openCreateMiniPage}
            >
                New
            </button>
            <table className="table table-striped ">
                <thead>
                <tr>
                    <th>Id</th>
                    {headers}
                    <th/>
                </tr>
                </thead>
                <tbody>
                {this.entities}
                </tbody>
            </table>
            {
                this.state.isCreateMiniPageOpen ?
                    <EntityCreateMiniPage
                        header={`New ${this.props.header}`}
                        columns={this.props.columns}
                        onClose={::this.closeCreateMiniPage}
                        onSave={::this.onCreateMiniSave}
                    /> : null
            }
        </div>
    }
};
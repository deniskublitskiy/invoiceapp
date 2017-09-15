import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    changeCustomer, createCustomer, deleteCustomer, editRecord, fetchCustomers,
    saveCustomer
} from '../../actions/customers';
import EditableSection from '../EditableSection/index';

@connect(
    state => ({
        customers: state.customers.all,
        current: state.customers.current
    }),
    {
        fetchCustomers,
        editRecord,
        changeCustomer,
        saveCustomer,
        deleteCustomer,
        createCustomer
    }
)
export default class Customers extends Component {

    componentDidMount() {
        this.props.fetchCustomers();
    }

    render() {
        let columns = [
            {header: 'Name', name: 'name'},
            {header: 'Address', name: 'address'},
            {header: 'Phone', name: 'phone', addon: <span className="glyphicon glyphicon-phone-alt"/>}
        ];

        return <EditableSection
            header="customer"
            entities={this.props.customers}
            current={this.props.current}
            columns={columns}
            createEntity={this.props.createCustomer}
            editRecord={this.props.editRecord}
            changeEntity={this.props.changeCustomer}
            saveEntity={this.props.saveCustomer}
            deleteEntity={this.props.deleteCustomer}
        />;
    }
};
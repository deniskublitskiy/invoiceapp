import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { fetchInvoices } from '../../../actions/invoices';
import _ from 'lodash';
import { fetchCustomers } from '../../../actions/customers';

@connect(
    state => ({
        invoices: state.invoices.all,
        customers: state.customers.all
    }),
    {
        fetchInvoices,
        fetchCustomers
    }
)
export default class Invoices extends Component {

    static defaultProps = {};

    state = {
        invoices: []
    };

    async componentDidMount() {
        this.props.fetchCustomers();
        this.props.fetchInvoices();
    }

    noColumnDataCaption = 'No data';

    prepareColumnValue(value) {
        return (!value && value !== 0) ? this.noColumnDataCaption : value
    }

    render() {
        let invoices = this.props.invoices.map(
            (invoice, index) => {
                // let invoiceColumns = Object
                //     .keys(invoice)
                //     .map((invoiceColumn, index) => <td key={index}>{invoice[invoiceColumn]}</td>);
                let customer = _.find(this.props.customers, ["id", invoice.customer_id]);
                customer = customer ? customer.name : null

                return <tr key={index}>
                    {/*invoiceColumns*/}
                    <td>{this.prepareColumnValue(invoice.id) }</td>
                    <td>{this.prepareColumnValue(customer) }</td>
                    <td>{this.prepareColumnValue(invoice.discount) }</td>
                    <td>{this.prepareColumnValue(invoice.total) }</td>
                    <td>
                        <Link to={`/invoices/${invoice.id}`} type="button"
                              className="btn btn-default btn-sm">Open</Link>
                    </td>
                </tr>
            });

        return <div>
            <h3>Invoices</h3>
            <Link
                to="/invoices/new"
                type="button"
                className="btn btn-success"
            >
                New
            </Link>
            <table className="table table-striped ">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Customer</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {invoices}
                </tbody>
            </table>
        </div>
    }
}
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    addProductToInvoice, changeInvoice, createInvoice, fetchInvoice, removeInvoiceProduct,
    saveInvoiceSuccess
} from '../../../actions/invoices';
import _ from 'lodash';
import ProductsLookupPage from '../ProductsLookupPage/index';
import { createCustomer, fetchCustomers } from '../../../actions/customers';
import { changeProductItem } from '../../../actions/products';
import EntityCreateMiniPage from '../../EntityCreateMiniPage/index';

@connect(state => ({
        invoice: {...state.invoices.current},
        customers: state.customers.all,
        defaultValues: state.invoices.default
    }),
    {
        createInvoice,
        changeInvoice,
        setValues: saveInvoiceSuccess,
        fetchInvoice,
        fetchCustomers,
        addProductToInvoice,
        changeProductItem,
        removeInvoiceProduct,
        createCustomer
    }
)
export default class InvoicePage extends Component {

    state = {
        isProductsLookupOpen: false,
        isCreateMiniPageOpen: false
    };

    async componentDidMount() {
        if (this.isEditModeMode) {
            try {
                await this.props.fetchInvoice(this.props.match.params.id);
            } catch(e) {
                this.props.history.push('/invoices');
                return
            }
        } else {
            this.props.createInvoice(this.props.defaultValues);
        }
        this.props.fetchCustomers();
    }

    componentWillUnmount() {
        this.setDefaultValues();
    }

    setDefaultValues() {
        this.props.setValues(this.props.defaultValues);
    }

    get isEditModeMode() {
        let match = this.props.match;
        return match && match.params && match.params.id;
    }

    get caption() {
        return this.props.invoice.id ? `Invoice ${this.props.invoice.id}` : 'New invoice';
    }

    get customers() {
        return this.props.customers.map((customer, index) =>
            <option
                key={index}
                value={customer.id}
                // selected={customer.id === this.props.invoice.customer_id}
            >
                {customer.name}
            </option>
        )
    }

    get products() {
        let products = this.props.invoice.products.map((product, index) =>
            <tr key={index}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                    <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={product.quantity}
                        data-column="quantity"
                        data-product_item_id={product.id}
                        onChange={::this.onProductChange}
                    />
                </td>
                <td>
                    <button className="btn btn-danger" onClick={e => this.onRemoveProduct(e, product.id)}>Delete</button>
                </td>
            </tr>
        );

        return <table className="table table-striped">
            <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th/>
            </tr>
            </thead>
            <tbody>
            {products}
            </tbody>
        </table>
    }

    onChange({target}) {
        let column = target.getAttribute('data-column');
        let {value} = target;
        let params = {
            [column]: value,
        };
        if (column === 'discount') {
            params.total = this.calculateTotal(parseInt(value), this.props.invoice.products);
        }

        if (column === 'customer_id' && value === 'new') {
            this.openCreateCustomerMiniPage();
            return;
        }
        this.props.changeInvoice(this.props.invoice.id, params);
    }

    onProductChange({target}) {
        let productItemId = target.getAttribute('data-product_item_id');
        let column = target.getAttribute('data-column');
        let {value} = target;
        this.props.changeProductItem(this.props.invoice.id, productItemId, {
            [column]: value
        });
        let products = [...this.props.invoice.products];
        productItemId = isNaN(productItemId) ? productItemId : parseInt(productItemId);
        _.find(products, ['id', productItemId]).quantity = value;

        this.props.changeInvoice(this.props.invoice.id, {
            total: this.calculateTotal(this.props.invoice.discount, products)
        });
    }

    onRemoveProduct(e, id) {
        this.props.removeInvoiceProduct(this.props.invoice.id, id);
        this.props.changeInvoice(this.props.invoice.id, {
            total: this.calculateTotal(
                this.props.invoice.discount,
                this.props.invoice.products.filter(product => product.id !== id)
            )
        });
    }

    openProductsLookup() {
        this.setState({
            isProductsLookupOpen: true
        })
    }

    closeProductsLookup() {
        this.setState({
            isProductsLookupOpen: false
        })
    }

    calculateTotal(discount, products) {
        discount = discount || 0;
        let total =
            products.reduce(
                (total, current) => {
                    let quantity = current.quantity || 1;
                    return total + quantity * current.price
                }, 0
            );
        return total * (100 - discount ) / 100;
    }

    onProductSelect(product) {
        this.props.changeInvoice(this.props.invoice.id, {
            total: this.calculateTotal(this.props.invoice.discount, [...this.props.invoice.products, product])
        });

        this.props.addProductToInvoice(this.props.invoice.id, {product_id: product.id, quantity: 1});
    }

    openCreateCustomerMiniPage() {
        this.setIsCreateCustomerMiniPageOpen(true);
    }

    closeCreateCustomerMiniPage() {
        this.setIsCreateCustomerMiniPageOpen(false);
    }

    setIsCreateCustomerMiniPageOpen(value) {
        this.setState({
            isCreateMiniPageOpen: value
        })
    }

    onCreateCustomerMiniSave(entity) {
        this.props.createCustomer(entity);
    }

    render() {
        return this.props.invoice.isFetching
            ? <h5>Loading...</h5>
            : <div>
                <h3>
                    {this.caption}
                    <span className="label label-info pull-right">Total: {this.props.invoice.total.toFixed(2)} $</span>
                </h3>
                {/*<button className="btn btn-success">Save</button>*/}
                <div className="form-group page-content">
                    <label htmlFor="invoiceDiscount">Discount</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="invoiceDiscount"
                            className="form-control"
                            placeholder="Discount"
                            value={this.props.invoice.discount}
                            min="0"
                            max="100"
                            data-column="discount"
                            onChange={::this.onChange}
                        />
                        <span className="input-group-addon">%</span>
                    </div>
                    <label htmlFor="invoiceCustomer">Customer</label>
                    <select
                        className="form-control" id="invoiceCustomer"
                        onChange={::this.onChange}
                        data-column="customer_id"
                        value={this.props.invoice.customer_id || ''}
                    >
                        <option/>
                        <option value="new">CREATE NEW...</option>
                        {this.customers}
                    </select>
                </div>
                <h5>
                    Products
                    <button
                        className="btn btn-default btn-sm detail-add-button"
                        onClick={::this.openProductsLookup}
                    >
                        <span className="glyphicon glyphicon-plus"/>
                    </button>
                </h5>
                {
                    this.props.invoice.products.length
                        ? this.products
                        : <div className="text-center">No data selected</div>
                }
                {
                    this.state.isProductsLookupOpen
                        ? <ProductsLookupPage
                            onClose={::this.closeProductsLookup}
                            onSelect={::this.onProductSelect}
                        />
                        : <div/>
                }
                {
                    this.state.isCreateMiniPageOpen ?
                        <EntityCreateMiniPage
                            header="New product"
                            columns={[
                                {header: 'Name', name: 'name'},
                                {header: 'Address', name: 'address'},
                                {header: 'Phone', name: 'phone', addon: <span className="glyphicon glyphicon-phone-alt"/>}
                            ]}
                            onClose={::this.closeCreateCustomerMiniPage}
                            onSave={::this.onCreateCustomerMiniSave}
                        /> : null
                }
            </div>
    }
}
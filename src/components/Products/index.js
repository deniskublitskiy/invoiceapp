import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    changeProduct, createProduct, deleteProduct, editRecord, fetchProducts,
    saveProduct
} from '../../actions/products';
import EditableSection from '../EditableSection';

@connect(
    state => ({
        products: state.products.all,
        current: state.products.current
    }),
    {
        fetchProducts,
        editRecord,
        createProduct,
        changeProduct,
        saveProduct,
        deleteProduct
    }
)
export default class Products extends Component {

    componentDidMount() {
        this.props.fetchProducts();
    }

    render() {
        let columns = [
            {header: 'Name', name: 'name', type: "text"},
            {header: 'Price', name: 'price', type: "number", addon: "$"}
        ];

        return <EditableSection
            header="product"
            entities={this.props.products}
            current={this.props.current}
            columns={columns}
            createEntity={this.props.createProduct}
            editRecord={this.props.editRecord}
            changeEntity={this.props.changeProduct}
            saveEntity={this.props.saveProduct}
            deleteEntity={this.props.deleteProduct}
        />;
    }
};
import React, { Component } from 'react';
import { createProduct, fetchProducts, saveProduct } from '../../../actions/products';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import _ from 'lodash';
import EntityCreateMiniPage from '../../EntityCreateMiniPage';

@connect(state => ({
        products: _.differenceWith(
            state.products.all, state.invoices.current.products, (a, b) =>
                a.id === b.product_id
        )
    }),
    {
        fetchProducts,
        createEntity: createProduct
    })
export default class ProductsLookupPage extends Component {

    state = {
        selected: null,
        isCreateMiniPageOpen: false,
    };

    componentDidMount() {
        this.props.fetchProducts()
    }

    get products() {
        return this.props.products.map((product, index) =>
            <tr key={index}>
                <td>{product.name}</td>
                <td>{product.price}</td>
            </tr>
        )
    }

    onSelectRow(row, isSelect) {
        this.setState({
            selected: isSelect ? row.id : null
        })
    }

    onSelect() {
        this.props.onSelect(_.find(this.props.products, ['id', this.state.selected]));
        this.onClose();
    }

    onClose() {
        this.props.onClose();
    }

    setIsCreateMiniPageOpen(value) {
        this.setState({
            isCreateMiniPageOpen: value
        })
    }

    openCreateMiniPage() {
        this.setIsCreateMiniPageOpen(true);
    }

    closeCreateMiniPage() {
        this.setIsCreateMiniPageOpen(false);
    }

    onCreateMiniSave(entity) {
        this.props.createEntity(entity);
    }

    render() {
        const selectRowProp = {
            mode: 'radio',
            clickToSelect: true,
            bgColor: 'pink',
            onSelect: this.onSelectRow.bind(this)
        };

        const miniPageColumns = [
            {header: 'Name', name: 'name', type: 'text'},
            {header: 'Price', name: 'price', type: 'number', addon: '$'}
        ];

        return <div>
            <div className="modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">
                                Products
                            </h4>
                            <h6>Click to select</h6>
                            <button
                                className="btn btn-success"
                                onClick={::this.openCreateMiniPage}
                            >
                                New
                            </button>
                        </div>
                        <div className="modal-body">
                            <BootstrapTable data={this.props.products} selectRow={selectRowProp}>
                                <TableHeaderColumn isKey dataField='id'>Id</TableHeaderColumn>
                                <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='price'>Price</TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={::this.onClose}>Cancel</button>
                            <button type="button" className="btn btn-success" disabled={!this.state.selected}
                                    data-dismiss="modal" onClick={::this.onSelect}>
                                Choose
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.state.isCreateMiniPageOpen ?
                    <EntityCreateMiniPage
                        header="New product"
                        columns={miniPageColumns}
                        onClose={::this.closeCreateMiniPage}
                        onSave={::this.onCreateMiniSave}
                    /> : null
            }
        </div>
    }
};
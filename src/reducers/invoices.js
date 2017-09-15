import {
    ADD_INVOICE_PRODUCT_SUCCESS,
    FETCH_INVOICE, FETCH_INVOICE_SUCCESS, FETCH_INVOICES_SUCCESS, REMOVE_INVOICE_PRODUCT_SUCCESS,
    SAVE_INVOICE_SUCCESS
} from '../actions/invoices';
import { CHANGE_PRODUCT_ITEM_SUCCESS } from '../actions/products';

const initialState = {
    all: [],
    current: {
        customer_id: null,
        products: [],
        total: 0,
        discount: 0
    },
};

initialState.default = initialState.current;

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_INVOICES_SUCCESS:
            return {
                ...state,
                all: action.invoices,
            };
        case FETCH_INVOICE:
            return {
                ...state,
                current: {...state.current, isFetching: true}
            };
        case FETCH_INVOICE_SUCCESS:
            action.invoice.isFetching = false;
            return {
                ...state,
                current: action.invoice,
            };

        case SAVE_INVOICE_SUCCESS:
            return {
                ...state,
                current: {...state.current, ...action.invoice, isFetching: false}
            };

        case ADD_INVOICE_PRODUCT_SUCCESS:
            return {
                ...state,
                current: {
                    ...state.current,
                    products: [...state.current.products, {...action.product, ...action.productItem}]
                }
            };

        case REMOVE_INVOICE_PRODUCT_SUCCESS:
            products = state.current.products.filter(product => product.id !== action.productId);
            return {
                ...state,
                current: {
                    ...state.current,
                    products
                }
            };

        case CHANGE_PRODUCT_ITEM_SUCCESS:
            let products = state.current.products;
            let index = _.findIndex(products, ['id', action.productItem.id]);
            let product = products[index];
            products = [
                ...products.slice(0, index),
                {...product, ...action.productItem },
                ...products.slice(index + 1)
            ];
            return {
                ...state,
                current: {
                    ...state.current,
                    products
                }
            };

        default:
            return state;
    }
}
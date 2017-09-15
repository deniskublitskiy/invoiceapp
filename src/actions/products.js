import { apiUrl } from '../config';

export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCT_SUCCESS = 'FETCH_PRODUCT_SUCCESS';
export const SAVE_PRODUCT_SUCCESS = 'SAVE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const CHANGE_PRODUCT = 'CHANGE_PRODUCT';
export const CHANGE_PRODUCT_ITEM_SUCCESS = 'CHANGE_PRODUCT_ITEM_SUCCESS';

export const changeProductItem = (invoiceId, productItemId, params) => async dispatch => {
    changeProductItemSuccess(params);
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/invoices/${invoiceId}/items/${productItemId}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
    } catch (e) {
        console.error(e);
    }
};

export const fetchProducts = () => async dispatch => {
    let request = new Request(`${apiUrl}/products`);

    try {
        let response = await fetch(request);
        let data = await response.json();
        response.ok && dispatch(fetchProductsSuccess(data));
    } catch (e) {
        console.error(e);
    }
};

export const fetchProduct = id => async dispatch => {
    let request = new Request(`${apiUrl}/products/${id}`);

    try {
        let response = await fetch(request);
        let product = await response.json();
        if (response.ok) {
            dispatch(fetchProductSuccess(product));
        }
    } catch (e) {
        console.error(e);
    }
};

export const changeProduct = (id, product) => ({
    type: CHANGE_PRODUCT,
    product
});

export const saveProduct = (id, params) => async dispatch => {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/products/${id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
        response.ok && dispatch(saveProductSuccess(params))
    } catch (e) {
        console.error(e);
    }
};

export const createProduct = params => async dispatch => {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/products`, {
        headers,
        method: 'POST',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
        let data = await response.json();
        response.ok && dispatch(createProductSuccess(data))
    } catch (e) {
        console.error(e);
    }
};

export const deleteProduct = id => async dispatch => {
    let request = new Request(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
    });

    try {
        let response = await fetch(request);
        response.ok && dispatch(deleteProductSuccess(id))
    } catch (e) {
        console.error(e);
    }
};

export const saveProductSuccess = product => ({
    type: SAVE_PRODUCT_SUCCESS,
    product
});

export const createProductSuccess = product => ({
    type: CREATE_PRODUCT_SUCCESS,
    product
});

export const deleteProductSuccess = id => ({
    type: DELETE_PRODUCT_SUCCESS,
    id
});

const fetchProductsSuccess = products => ({
    type: FETCH_PRODUCTS_SUCCESS,
    products: products
});

const fetchProductSuccess = product => ({
    type: FETCH_PRODUCT_SUCCESS,
    product: product
});

export const editRecord = id => ({
    type: EDIT_PRODUCT,
    id
});

const changeProductItemSuccess = productItem => ({
    type: CHANGE_PRODUCT_ITEM_SUCCESS,
    productItem
});
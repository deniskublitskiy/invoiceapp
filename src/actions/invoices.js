import { apiUrl } from '../config';

export const FETCH_INVOICES_SUCCESS = 'FETCH_INVOICES_SUCCESS';
export const FETCH_INVOICE_SUCCESS = 'FETCH_INVOICE_SUCCESS';
export const FETCH_INVOICE = 'FETCH_INVOICE';
export const ADD_INVOICE_PRODUCT_SUCCESS = 'ADD_INVOICE_PRODUCT_SUCCESS';
export const SAVE_INVOICE_SUCCESS = 'SAVE_INVOICE_SUCCESS';
export const REMOVE_INVOICE_PRODUCT_SUCCESS = 'REMOVE_INVOICE_PRODUCT_SUCCESS';

export const fetchInvoices = () => async dispatch => {
    let request = new Request(`${apiUrl}/invoices`);
    try {
        let response = await fetch(request);
        let data = await response.json();
        response.ok && dispatch(fetchInvoicesSuccess(data));
    } catch (e) {
        console.error(e);
    }
};

export const fetchInvoice = id => async dispatch => {
    dispatch({type: FETCH_INVOICE});
    let request = new Request(`${apiUrl}/invoices/${id}`);
    try {
        let response = await fetch(request);
        let invoice = await response.json();
        if (response.ok) {
            let invoiceItemsRequest = new Request(`${apiUrl}/invoices/${id}/items`);
            let response = await fetch(invoiceItemsRequest);
            let productItems = await response.json();
            let products = await Promise.all(productItems.map(
                productItem => fetch(`${apiUrl}/products/${productItem.product_id}`)
            ));
            products = await Promise.all(products.map(product => product.json()));
            invoice.products = productItems.map((
                productItem, index) => ({...products[index], ...productItem})
            );
            dispatch(fetchInvoiceSuccess(invoice));
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const createInvoice = params => async dispatch => {
    dispatch({type: FETCH_INVOICE});
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/invoices`, {
        headers,
        method: 'POST',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
        let data = await response.json();
        response.ok && dispatch(saveInvoiceSuccess(data))
    } catch (e) {
        console.error(e);
    }
};

export const changeInvoice = (id, params) => async dispatch => {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/invoices/${id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
        let data = await response.json();
        response.ok && dispatch(saveInvoiceSuccess(params))
    } catch (e) {
        console.error(e);
    }
};

export const addProductToInvoice = (invoiceId, params) => async dispatch => {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/invoices/${invoiceId}/items`, {
        headers,
        method: 'POST',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
        let productItem = await response.json();
        response = await fetch(`${apiUrl}/products/${params.product_id}`);
        let product = await response.json();
        response.ok && dispatch(addInvoiceProductSuccess(productItem, product))
    } catch (e) {
        console.error(e);
    }
};


export const removeInvoiceProduct = (invoiceId, productId) => async dispatch => {
    let request = new Request(`${apiUrl}/invoices/${invoiceId}/items/${productId}`, {
        method: 'DELETE',
    });

    try {
        let response = await fetch(request);
        response.ok && dispatch(removeInvoiceProductSuccess(productId))
    } catch (e) {
        console.error(e);
    }
};

const fetchInvoicesSuccess = invoices => ({
    type: FETCH_INVOICES_SUCCESS,
    invoices
});

export const saveInvoiceSuccess = invoice => ({
    type: SAVE_INVOICE_SUCCESS,
    invoice
});

const fetchInvoiceSuccess = invoice => ({
    type: FETCH_INVOICE_SUCCESS,
    invoice,
    isFetching: false
});

const addInvoiceProductSuccess = (productItem, product) => ({
    type: ADD_INVOICE_PRODUCT_SUCCESS,
    product,
    productItem
});

const removeInvoiceProductSuccess = productId => ({
    type: REMOVE_INVOICE_PRODUCT_SUCCESS,
    productId
});
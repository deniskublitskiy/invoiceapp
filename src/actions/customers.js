import { apiUrl } from '../config';

export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMER_SUCCESS = 'FETCH_CUSTOMER_SUCCESS';
export const SAVE_CUSTOMER_SUCCESS = 'SAVE_CUSTOMER_SUCCESS';
export const CREATE_CUSTOMER_SUCCESS = 'CREATE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const EDIT_CUSTOMER = 'EDIT_CUSTOMER';
export const CHANGE_CUSTOMER = 'CHANGE_CUSTOMER';

export const fetchCustomers = () => async dispatch => {
    let request = new Request(`${apiUrl}/customers`);

    try {
        let response = await fetch(request);
        let data = await response.json();
        response.ok && dispatch(fetchCustomersSuccess(data));
    } catch (e) {
        console.error(e);
    }
};

export const fetchCustomer = id => async dispatch => {
    let request = new Request(`${apiUrl}/customers/${id}`);

    try {
        let response = await fetch(request);
        let customer = await response.json();
        if (response.ok) {
            dispatch(fetchCustomerSuccess(customer));
        }
    } catch (e) {
        console.error(e);
    }
};

export const changeCustomer = (id, customer) => ({
    type: CHANGE_CUSTOMER,
    customer
});

export const saveCustomer = (id, params) => async dispatch => {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/customers/${id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
        response.ok && dispatch(saveCustomerSuccess(params))
    } catch (e) {
        console.error(e);
    }
};

export const createCustomer = params => async dispatch => {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    let request = new Request(`${apiUrl}/customers`, {
        headers,
        method: 'POST',
        body: JSON.stringify(params)
    });

    try {
        let response = await fetch(request);
        let data = await response.json();
        response.ok && dispatch(createCustomerSuccess(data))
    } catch (e) {
        console.error(e);
    }
};

export const deleteCustomer = id => async dispatch => {
    let request = new Request(`${apiUrl}/customers/${id}`, {
        method: 'DELETE',
    });

    try {
        let response = await fetch(request);
        response.ok && dispatch(deleteCustomerSuccess(id))
    } catch (e) {
        console.error(e);
    }
};

export const saveCustomerSuccess = customer => ({
    type: SAVE_CUSTOMER_SUCCESS,
    customer
});

export const createCustomerSuccess = customer => ({
    type: CREATE_CUSTOMER_SUCCESS,
    customer
});

export const deleteCustomerSuccess = id => ({
    type: DELETE_CUSTOMER_SUCCESS,
    id
});

const fetchCustomersSuccess = customers => ({
    type: FETCH_CUSTOMERS_SUCCESS,
    customers: customers
});

const fetchCustomerSuccess = customer => ({
    type: FETCH_CUSTOMER_SUCCESS,
    customer: customer
});

export const editRecord = id => ({
    type: EDIT_CUSTOMER,
    id
});
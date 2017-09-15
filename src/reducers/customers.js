import {
    CHANGE_CUSTOMER, CREATE_CUSTOMER_SUCCESS, DELETE_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER, FETCH_CUSTOMER_SUCCESS, FETCH_CUSTOMERS_SUCCESS,
    SAVE_CUSTOMER_SUCCESS
} from '../actions/customers';

import _ from 'lodash';

const initialState = {
    all: [],
    current: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CUSTOMERS_SUCCESS:
            return {
                ...state,
                all: action.customers
            };
        case FETCH_CUSTOMER_SUCCESS:
            return {
                ...state,
                current: action.customer
            };

        case SAVE_CUSTOMER_SUCCESS:
            let all = state.all;
            let index = _.findIndex(all, ['id', action.customer.id]);
            all[index] = {...all[index], ...action.customer};

            return {
                ...state,
                all: [...all],
                current: {}

            };

        case CREATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                all: [...state.all, action.customer]
            };

        case DELETE_CUSTOMER_SUCCESS:
            all = state.all.filter(customer => customer.id !== action.id);
            return {
                ...state,
                all,
                current: {}
            };

        case EDIT_CUSTOMER:
            return {
                ...state,
                current: {
                    ..._.find(state.all, ['id', action.id])
                }
            };

        case CHANGE_CUSTOMER:
            return {
                ...state,
                current: {...state.current, ...action.customer, isChanged: true}
            };

        default:
            return state;
    }
}
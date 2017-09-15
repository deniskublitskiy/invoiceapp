import {
    CHANGE_PRODUCT, CREATE_PRODUCT_SUCCESS, DELETE_PRODUCT_SUCCESS,
    EDIT_PRODUCT, FETCH_PRODUCT_SUCCESS, FETCH_PRODUCTS_SUCCESS,
    SAVE_PRODUCT_SUCCESS
} from '../actions/products';

import _ from 'lodash';

const initialState = {
    all: [],
    current: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                all: action.products
            };
        case FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                current: action.product
            };

        case SAVE_PRODUCT_SUCCESS:
            let all = state.all;
            let index = _.findIndex(all, ['id', action.product.id]);
            all[index] = {...all[index], ...action.product};

            return {
                ...state,
                all: [...all],
                current: {}

            };

        case CREATE_PRODUCT_SUCCESS:
            return {
                ...state,
                all: [...state.all, action.product]
            };

        case DELETE_PRODUCT_SUCCESS:
            all = state.all.filter(product => product.id !== action.id);
            return {
                ...state,
                all,
                current: {}
            };

        case EDIT_PRODUCT:
            return {
                ...state,
                current: {
                    ..._.find(state.all, ['id', action.id])
                }
            };

        case CHANGE_PRODUCT:
            return {
                ...state,
                current: {...state.current, ...action.product, isChanged: true}
            };

        default:
            return state;
    }
}
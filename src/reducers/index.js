import { combineReducers } from 'redux';

import invoices from './invoices';
import products from './products';
import customers from './customers';

export default combineReducers({
    invoices,
    products,
    customers
});
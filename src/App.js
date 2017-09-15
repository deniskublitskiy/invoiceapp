import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import Invoices from './components/Invoices/Section';
import Products from './components/Products';
import Customers from './components/Customers';
import Navigation from './components/Navigation';
import InvoicePage from './components/Invoices/Page';
import reducer from './reducers';

import './app.sass'
import NotFound from './components/NotFound';

const store = createStore(
    reducer,
    applyMiddleware(
        thunk,
        logger
    ));
console.group('Initial store');
console.log(store.getState());
console.groupEnd();

export default class App extends Component {
    render() {
        return <Provider store={store}>
            <Router>
                <div>
                    <Navigation/>
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Invoices}/>
                            <Route exact path="/invoices" component={Invoices}/>
                            {/*<Route path="/invoices/:id(\d+)" component={InvoicePage}/>*/}
                            <Route exact path="/invoices/new" component={InvoicePage}/>
                            <Route path="/invoices/:id" component={InvoicePage}/>
                            <Route exact path="/products" component={Products}/>
                            <Route exact path="/customers" component={Customers}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </div>
            </Router>
        </Provider>
    }
}
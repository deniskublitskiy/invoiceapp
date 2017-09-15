import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Navigation extends Component {
    render() {
        return <nav className="navbar navbar-default navbar-static-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                    </button>
                    <NavLink className="navbar-brand" to="/">Invoice App</NavLink>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav">
                        <li><NavLink to="/products">Products</NavLink></li>
                        <li><NavLink to="/customers">Customers</NavLink></li>
                        <li><NavLink to="/invoices">Invoices</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    }
}
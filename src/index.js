import React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'regenerator-runtime/runtime';
import App from './App';

const render = Component => ReactDOM.render(
    <AppContainer>
        <Component/>
    </AppContainer>,
    document.getElementById('app')
);

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
        render(App);
    })
}
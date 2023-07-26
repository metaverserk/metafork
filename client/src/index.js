import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import './assets/css/reset.css';
import './assets/css/main.css';
import store from './redux/store';
import {Provider} from 'react-redux';




const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <BrowserRouter>
        <React.StrictMode>
            <Provider store={store} >
                <App store={store} />
            </Provider>
        </React.StrictMode>
    </BrowserRouter>
);


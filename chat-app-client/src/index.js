import ReactDom from "react-dom";
import React from 'react'
import {Provider} from 'react-redux'
import App from './App.js'
import {store} from './store.js'

ReactDom.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import styles from 'AliasStyles/style.scss';
import ReactEventEmitter, { ConfigListeners } from 'elmer-react-event';

ConfigListeners({
    reactEvent: (data) => {
        console.log('event out react', data);
    }
});

window.onload = () => {
    const app = document.getElementById('app');
    // const rootPath = __dirname;
    if (app) {
        const RootComponent = ReactEventEmitter(Root);
        const config = {
            redirectRouter: false,
            RootPath: __dirname,
            host: 'index.html',
            debug: false
        };
        ReactDOM.render(<RootComponent {...config} />, app);
        app.className = styles.app;
    }
};

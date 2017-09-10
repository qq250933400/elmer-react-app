import React from 'react';
import PropTypes from 'prop-types';
import ElmerRouter from 'elmer-react-router';
import configStore from '../state/configStore';
import Pages from '../pages/index.json';
import Language from '../common/component/Language';
import Container from '../state/container';
import axiosConfig from '../../config/axios.config';
import { Provider } from 'react-redux';
import { AxiosProvider } from 'elmer-react-axios';
import { ComponentExd } from '../common/index';

class Root extends ComponentExd {
    onRouter (nextProps) {
        const { app } = nextProps.route;
        if (app === 'AppMobile') {
            document.body.classList.add(this.getStyle('mobile'));
            document.body.classList.add(this.getStyle('theme_default'));
        }
    }
    render () {
        const axConfig = window.elmer.axiosConfig || axiosConfig;
        return (
            <Provider store={configStore}>
                <AxiosProvider axiosConfig={axConfig}>
                    <ElmerRouter debug={false} pages={Pages} statePages={{}} {...this.props}
                        setPageContainer={(props) => {
                            this.onRouter(props);
                            return (
                                <Language {...props}>
                                    <Container />
                                </Language>
                            );
                        }}
                    />
                </AxiosProvider>
            </Provider>
        );
    }
}

Root.propTypes = {
    host: PropTypes.string.isRequired,
    redirectRouter: PropTypes.bool.isRequired
};

Root.defaultProps = {
    host: '/',
    redirectRouter: true
};

export default Root;

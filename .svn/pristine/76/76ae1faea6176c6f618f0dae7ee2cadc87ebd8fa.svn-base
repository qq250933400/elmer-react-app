import path from 'path';

const ENV = process.env.EXEC_ENV || 'development';

let config = {
    APP_PATH: 'src',
    APP_MAIN: 'index.js',
    COMPLITER_PUBLIC_PATH: '/',
    DIST_PATH: 'build',
    ENV: process.env.EXEC_ENV || 'development',
    HOST: 'localhost',
    DEV_SERVER_PORT: process.env.DEV_SERVER_PORT || 3000,
    REACT_DEVTOOLS_PORT: process.env.REACT_DEVTOOLS_PORT || 8097,
    REDUX_DEVTOOLS_PORT: process.env.REDUX_DEVTOOLS_PORT || 8000,
    ROOT_PATH: path.resolve(__dirname, '../')
};

config.GLOBALS = {
    'process.env': {
        'EXEC_ENV': JSON.stringify(ENV)
    },
    "EXEC_ENV": ENV,
    '__DEV__': ENV === 'development',
    '__PROD__': ENV === 'production'
};

config.UTILS_PATH = (() => {
    const resolve = path.resolve;
    const base = (...args) => resolve.apply(resolve, [config.ROOT_PATH, ...args]);
    return {
        base,
        client: base.bind(null, config.APP_PATH),
        dist: base.bind(null, config.DIST_PATH)
    }
})();

if (ENV === 'development') {
    const overrides = {
        COMPLITER_PUBLIC_PATH: `http://${config.HOST}:${config.DEV_SERVER_PORT}/`
    }
    config = Object.assign({}, config, overrides);
}

export default config;

import webpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import config from './config';
import webpackConfig from './webpack.dev.config';

import tmpServer from '../server/dev-server';

const compiler = webpack(webpackConfig);

const devServerConfig = {
    // contentBase: config.APP_PATH,
    // headers: { 'Access-Control-Allow-Origin': '*' },
    // historyApiFallBack: true,
    // quiet: false,
    // noInfo: false,
    // hot: true,
    // inline: true,
    // stats: { colors: true }
    contentBase:  config.APP_PATH,
    historyApiFallback: true,
    inline: true,
    disableHostCheck: true
};

const server = new webpackDevServer(compiler, devServerConfig);

// server.listen();
server.listen(config.DEV_SERVER_PORT, (state)=>{
     if (state === undefined) {
         console.log('server', webpackConfig.output.publicPath);
     }
});

// tmpServer();// start tmp server

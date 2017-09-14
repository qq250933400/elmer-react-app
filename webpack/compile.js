import webpack from 'webpack';
import gutil from 'gutil';
import ncp from 'ncp';
import webpackConfig from './webpack.build.config';
import config from './config';

const cp = ncp.ncp;
cp.limit = 16;
webpackConfig.output.publicPath = '';
const paths = config.UTILS_PATH;
const compiler = webpack(webpackConfig);
// console.log(JSON.stringify(config.UTILS_PATH), webpackConfig);
// throw new Error('error');
compiler.run((err,stats) => {
    if (err) {
        gutil.log(err);
        throw new gutil.PluginError('webpack:build', err);
    }
    const execEnv = process.env.EXC_ENV;
    if (execEnv === 'staging') {
        cp(`${paths.base('server/static')}`, `${paths.base('build/static')}`, (err) => {
            if (err) {
                gutil.log(err);
                throw new gutil.PluginError('webpack:build', err);
            }
            gutil.log('static mock copied.');
        });
    }
    gutil.log('[webpack:build]', stats.toString({
        chunks: false,
        colors: true
    }));
});
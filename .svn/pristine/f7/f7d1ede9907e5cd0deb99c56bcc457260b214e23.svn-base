var webpack = require('webpack');
var config = require('../config/webpack.config'),
    _plugins = require('../config/config.plugins.build');

config.plugins = _plugins;

var compiler = webpack(config);
var args = {};
function doneHandler(err, stats) {
    if (args.json) {
        const filename = typeof args.json === 'boolean' ? 'build-bundle.json' : args.json;
        const jsonPath = join(fileOutputPath, filename);
        writeFileSync(jsonPath, JSON.stringify(stats.toJson()), 'utf-8');
        console.log(`Generate Json File: ${jsonPath}`);
    }
    //如果出错，那么退出码是1
    const { errors } = stats.toJson();
    if (errors && errors.length) {
        process.on('exit', () => {
            process.exit(1);
        });
    }
    // if watch enabled only stats.hasErrors would log info
    // otherwise  would always log info
    if (!args.watch || stats.hasErrors()) {
        const buildInfo = stats.toString({
            colors: true,
            children: true,//添加子模块的信息，https://github.com/webpack/extract-text-webpack-plugin/issues/35
            chunks: !!args.verbose,
            modules: !!args.verbose,
            chunkModules: !!args.verbose,
            hash: !!args.verbose,//如果verbose为true表示有日志，那么我们会输出这部分内容
            version: !!args.verbose,
        });
        if (stats.hasErrors()) {
            console.error(buildInfo);
        } else {
            console.log(buildInfo);
        }
    }
    if (err) {
        process.on('exit', () => {
            process.exit(1);
        });
        console.error(err);
    }
    if (done) {
        done(err);
    }
}
function done(err){
    if(err) {
        console.log(err);
    }else {
        console.log('build complete!');
    }
}
compiler.run(doneHandler);

var path = require('path'),
    webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');
// require('font-awesome-webpack');
module.exports = {
    devtool: "eval-source-map",
    // entry: path.resolve(__dirname, "../src/index.js"),
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        path.resolve(__dirname,"../src/index.js")
    ],
    output: {
        path: path.resolve(__dirname, "../build"),
        filename: '[name].js',
        publicPath: "http://localhost:8080/",
        chunkFilename: '[name].[chunkhash].min.js'
    },
    module: {
        loaders: [
            {
                test:/\.(jsx|js)$/,
                // loader: "babel-loader"
                loaders: ["babel-loader", "eslint-loader"]
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }, {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: "svg-url-loader",
                exclude: /node_modules/
            },
            {
                test: /\.woff(\?.*)?$/,
                loader: "url-loader?limit=1000000&mimetype=application/font-woff&name=fonts/[hash].[ext]"
            },
            {
                test: /\.(eot|woff|ttf)(\?.*)?$/,
                loader: "file-loader?limit=1000000&name=fonts/[hash].[ext]"
            },
            {
                test: /\.(png|jpg|bmp|gif)(\?.*)?$/,
                loader: "url-loader?limit=25000&name=images/[hash].[ext]"
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules:[
            path.join(__dirname,'../src'),
            "node_modules"
        ],
        alias: {
            AliasStyles : path.resolve(__dirname,'../src/styles'),
            AliasCommon : path.resolve(__dirname,'../src/common'),
            AliasUI : path.resolve(__dirname,'../src/common/ui'),
            AliasImages: path.resolve(__dirname,'../src/styles/images')
        }
    },
    devServer: {
        contentBase:"../build/index.html",
        historyApiFallback: true,
        inline: true,
        open: true,
        port: 8080,
        host: '192.168.0.102'
    }
};
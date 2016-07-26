var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var publicPath = 'http://lx.waimai.baidu.com:1234/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
    entry: {
        index: [
            "./client/Wconsole/Wconsole.js",
        ],
        remote: [
            "./client/Wconsole/EventSource.js"
        ],
        toOther: [
            "./client/Wconsole/remote.js"
        ]
    }, 
    output: {
        path: path.join(__dirname, './public'),
        filename: '[name].entry.js',
        chunkFilename: "[id].chunk.js",
        publicPath: publicPath, //网站运行时的访问路径
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.css$/, 
            loader:  ExtractTextPlugin.extract("style-loader","css-loader")
        }, {
            test: /\.less$/,
            loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
        }]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),        
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'client/index.html'),
            inject: true,
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: 'remote.html',
            template: path.join(__dirname, 'client/remote.html'),
            inject: true,
            chunks: ['remote']
        }),
        new HtmlWebpackPlugin({
            filename: 'toOther.html',
            template: path.join(__dirname, 'client/toOther.html'),
            inject: true,
            chunks: ['toOther']
        }),
        //new webpack.optimize.CommonsChunkPlugin('common.js'),
        new ExtractTextPlugin("styles.css"), 
    ]
};

module.exports = devConfig;

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
    entry: [
        "./client/js/Wconsole.js",
    ],
/*    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: publicPath
    },  */  
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'Wconsole.entry.js',
        chunkFilename: "Wconsole.chunk.js",
        publicPath: publicPath, //网站运行时的访问路径
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
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
            inject: true
        })
    ]
};

module.exports = devConfig;

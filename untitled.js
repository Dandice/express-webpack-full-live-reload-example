var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
    host: host,
    port: port,
    entry: {
        main: [
            'webpack-dev-server/client?http://' + host + ':' + port,
            'webpack/hot/only-dev-server',
            "./client/js/Wconsole.js",
        ]
    },
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'Wconsole.entry.js',
        chunkFilename: "[id].chunk.js",
        publicPath: publicPath, //网站运行时的访问路径
    },
    externals: {
        // 在浏览器端对应window.React
        // 'npm-react': 'React',
        // zepto后续要拆分出去
        // 'npm-zepto': 'Zepto'
    },
    plugins: [
        // 热替换 防止报错插件
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // new WebpackMd5Hash(),
        new webpack.optimize.DedupePlugin()
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/, // .js .jsx
            loader: 'react-hot',
            include: path.join(__dirname, 'client')
        }, {
            test: /\.jsx?$/, // .js .jsx
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            include: path.join(__dirname, 'client')
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader!less-loader!autoprefixer-loader?{browsers:["iOS >= 7","Android >= 4.0","last 2 Chrome versions","last 2 Safari versions"]}'
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader!autoprefixer-loader?{browsers:["iOS >= 7","Android >= 4.0","last 2 Chrome versions","last 2 Safari versions"]}'
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
        }]
    }
};

module.exports = devConfig;

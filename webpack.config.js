'use strict';

var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

var LibsLocation = {
  title: '云采集',
};

module.exports = function makeWebpackConfig() {
  var config = {};
  config.mode="development"
  config.entry = {
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-redux',
    ],
    wncrawl: './src/app.js',
		"editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
  };
  config.node ={
    fs: "empty",
    module: "empty"
  }

  config.output = {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    // globalObject: 'self',
  };

  config.devtool = 'inline-source-map';

  config.module = {
    noParse: /jspdf/,
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: [{
          loader: 'babel-loader?cacheDirectory=true',
          options: {
            cacheDirectory: true
          }
        }]
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader?{modifyVars:{"icon-url":"\'../../../../../src/assets/fonts/antd_icon\'"}}'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /(node_modules|dist)/,
        use: ['style-loader', 'css-loader', 'fast-sass-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)(\?[tv]=[\d.]+)*$/,
        exclude: /node_modules/,
        use: ['file-loader?name=assets/images/[name].[ext]']
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot)(\?[tv]=[\d.]+)*$/,
        exclude: /node_modules/,
        use: ['file-loader?name=assets/fonts/[name].[ext]']
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.ejs$/,
        use: ['ejs-loader']
      },
      {
        test: /\.json/,
        use: ['json-loader']
      }
    ]
  };

  config.resolve = {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'react/lib/ReactMount': 'react-dom/lib/ReactMount'
    }
  };


  config.plugins = [
    new webpack.DefinePlugin({
      __PRODUCTION: JSON.stringify(false)
    }),
		new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [
            autoprefixer({
              browsers: ['last 2 version']
            })
          ]
        }
      }
    }),

    new HtmlWebpackPlugin({
      filename: 'wncrawl.html',
      template: './src/public/WNCrawl.ejs',
      inject: 'body',
      chunks: ['wncrawl','editor.worker','vendor'],
      assets: {
        favicon: 'assets/images/favicon.ico',
        title: LibsLocation.title,
        config_js: 'config/config.dev.js',
        // vendors: 'assets/libs/vendors.dll.js',
        // dta: 'assets/libs/dta.js'
      }
    }),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /(zh-cn).js/),
    new webpack.ContextReplacementPlugin(
      /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
      __dirname
    ),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   // manifest: require('./manifest.json')
    // })
  ];

  config.devServer = {
    contentBase: './src',
    host: '0.0.0.0',
    port: 8091,
    hot: true,
    stats: 'minimal',
    proxy: [{
      path: '/api/**',
      // target: 'http://172.16.1.93:8111',
      // target: 'http://172.16.1.236:8111',
      // target: 'http://172.16.8.127',
      target: 'http://127.0.0.1:8111',
      secure: false,
      changeOrigin: true,
    }],
    setup: function (app) {},
  };

  config.externals = {
    'CRAWAPICONF': 'CRAWAPICONF',
  };

  return config;
}();
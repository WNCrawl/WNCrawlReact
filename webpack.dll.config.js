'use strict'
var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');


module.exports = function makeWebpackConfig(){
  var config = {};

  config.entry = {
    vendors: [
      // '@antv/data-set',
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      // 'redux-thunk',
      // 'react-color',
      // 'redux',
      // 'moment',
      // 'react-ace',
      // 'interact.js',
      // 'd3',
      // 'brace',
      // 'core-js',
      // 'object-assign',
      'mirror-creator',
      // 'jspdf',
      // 'recharts',
      // 'bizcharts',
      'lodash',
      // 'monaco-editor'
    ]
  };


  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress:{
            warnings: false,
            drop_console: true,
            drop_debugger: true,
          }
        }
      }),
    ]
  },

  config.output = {
    path: __dirname + '/src/assets/libs',
    filename: '[name].dll.js',
    library: '[name]_library'
  };
  
  config.plugins = [

    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js(\?.*)?$/i,
      cache: true,
      deleteOriginalAssets: true,
      threshold: 10240,
      minRatio: 0.8
  }),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest.json'),
      name: '[name]_library'
    })
  ];

  return config;


}
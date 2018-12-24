
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var LibsLocation = {
  title: '云采集',
};


module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-redux',
    ],
    app: './src/app.js'
  },
  mode: 'production',
  devtool: false,
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].bundle.[chunkhash:8].js',
    chunkFilename: '[name].bundle.[chunkhash:8].js',
  },
  optimization: {
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
  module:{
    noParse: /jspdf/,
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [[
              'import',
              {
                "libraryName": "antd",
                "style": true
              }
            ]]
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
      }
    ]
  },
  node: {
    fs: 'empty',
    module: 'empty'
  },
  performance: {
    hints: false
  },

  plugins:[
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      __PRODUCTION: JSON.stringify(true),

    }),
    new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js(\?.*)?$/i,
        cache: true,
        deleteOriginalAssets: true,
        threshold: 10240,
        minRatio: 0.8
    }),
    new HtmlWebpackPlugin({
      filename: 'wncrawl.html',
      template: './src/public/WNCrawl.ejs',
      inject: 'body',
      chunk: ['crew'],
      assets: {
        favicon: 'assets/images/favicon.ico',
        title: LibsLocation.title,
      },
      minify:{
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes:true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new webpack.ContextReplacementPlugin(
      /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
      __dirname
    ),

    new webpack.NoEmitOnErrorsPlugin(),

    new CopyWebpackPlugin([
      {
        from: 'src/index.html',
        to: 'index.html',
      },
      {
        from: 'src/config',
        to: 'config',
      },
      {
        from: 'src/assets',
        to: 'assets'
      }
    ],{ignore: ['*.scss']}),
    
    // new BundleAnalyzerPlugin()
  ]

}
const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const renderer = {
  entry: [
    // 'webpack-dev-server/client?http://localhost:8080',
    './src/index.js'
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.png$/, loader: 'file-loader', options: { name: 'images/[name].[ext]' }},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader', options: { name: 'fonts/[name].[ext]' }},
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader', options: { name: 'fonts/[name].[ext]' }},
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader', options: { name: 'fonts/[name].[ext]' }},
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader', options: { name: 'fonts/[name].[ext]' }},
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader', options: { name: 'fonts/[name].[ext]' }}
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'resource-runtime'),
      'node_modules'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'James Proxy',
      template: 'resource-runtime/index.html'
    })
  ],
  target: 'electron-renderer',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};

const main = {
  entry: {
    'main': './src/main/index.js'
  },
  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'resource-compile/package.json', transform: setVersion }
    ])
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-main',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};

function setVersion(buffer) {
  // comes in as a buffer, must return as buffer or string
  var package = JSON.parse(buffer.toString('utf-8'));
  package.version = require('./package.json').version;
  return JSON.stringify(package, null, '  '); // printy-print, 2-spaces
}

function productionize(config, options = {}, uglify = true) {
  if (!options.production) return config;
  if (!config.plugins) config.plugins = [];

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  )
  if (uglify) {
    // note: uglify + es6 don't get along, so skip main
    // TODO: look at using babili instead
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      })
    );
  }

  return config;
}

module.exports = function (options) {
  return [
    productionize(renderer, options, false),
    productionize(main, options, false)
  ]
}
const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const renderer = {
  entry: {
    'index': './src/index.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
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
    new CopyWebpackPlugin([
      { from: 'resource-runtime', ignore: ['fonts/**'] }, // fonts are handled by file-loader
      { from: 'resource-compile/package.json' } // TODO: set version
    ])
  ],
  target: 'electron-renderer',
  output: {
    filename: '[name].js',
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
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      })
    );
  }

  return config;
}

module.exports = function (options) {
  return [
    productionize(renderer, options),
    productionize(main, options, false)
  ]
}
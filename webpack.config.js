const path = require('path');
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

// TODO: set process.env.NODE_ENV = production for prod builds (webpack.DefinePlugin)

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

module.exports = [
  renderer,
  main
];

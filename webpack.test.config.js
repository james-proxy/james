const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                require('@babel/preset-env'), {
                  modules: false,
                  targets: {
                    node: 'current'
                  }
                }
              ],
              require('@babel/preset-react'),
              require('babel-preset-power-assert')
            ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      common: path.join(__dirname, '/src/common'),
      renderer: path.join(__dirname, '/src/renderer'),
      main: path.join(__dirname, '/src/main'),
    }
  },
  target: 'node',
  externals: [
    'child-killer'
  ]
};

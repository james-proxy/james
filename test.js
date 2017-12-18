const sinon = require('sinon');
sinon.behavior = {}; // backwards-compat for referee shenanigans
require('setup-referee-sinon/globals')

const webpack = require('webpack');
const createMochaWebpack = require('mocha-webpack/lib/createMochaWebpack.js')
const { ensureGlob, extensionsToGlob } = require('mocha-webpack/lib/util/glob');

const getWebpackConfig = require('electron-webpack/webpack.renderer.config.js')
const files = [
  "test/unit"
];

getWebpackConfig().then(webpackConfig => {
  const mocha = createMochaWebpack();
  mocha.reporter('dot');
  mocha.cwd(process.cwd());
  
  const extensions = ['.js'];
  const fileGlob = extensionsToGlob(extensions);
  files.forEach(f =>
    mocha.addEntry(ensureGlob(f, true, fileGlob))
  );

  delete webpackConfig.entry;
  webpackConfig.target = 'node';
  const [ jsRule ] = webpackConfig.module.rules;
  webpackConfig.module.rules = [
    jsRule,
    { test: /\.s?css$/, loader: 'null-loader' }
  ];
  webpackConfig.externals = [
    'expect',
    'child-killer'
  ];
  webpackConfig.plugins = [
    new webpack.ProvidePlugin({
      'sinon': 'sinon'
   })
  ];
  
  mocha.webpackConfig(webpackConfig);
  return mocha.run()
})
.then(failures => process.exit(failures))
.catch(err => {
  if (err) {
    console.error(err.stack);
  }
  process.exit(1);
});
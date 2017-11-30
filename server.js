var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var [renderer, main] = require('./webpack.config.js')();

var electron = require('electron');
var proc = require('child_process');
var child;

var port = 8080;

// start a live-reload server for renderer (in-memory)
function setupRenderer(resolve, reject) {
  renderer.entry.unshift(`webpack-dev-server/client?http://localhost:${port}`);
  new WebpackDevServer(webpack(renderer), {
    contentBase: renderer.output.path,
    historyApiFallback: true,
    stats: { colors: true }
  })
  .listen(port, 'localhost', (err, result) => {
    if (err) return reject(err);
    resolve();
  });
}

// start a watch compiler for main (writes to /dist)
function setupMain(resolve, reject) {
  webpack(main).watch({}, (err, stats) => {
    if (err) return reject(err);
    console.log(stats.toString({chunks: false, colors: true}));
    resolve();
  });
}

Promise.all([
  new Promise(setupRenderer),
  new Promise(setupMain)
]).then(() => {
  console.log("All ready, launching James!");
  child = proc.spawn(electron, ["./dist"]);
  child.stdout.on('data', data => console.log(data.toString('utf-8')));
  child.stderr.on('data', data => console.error(data.toString('utf-8')));
});

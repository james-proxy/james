const browserLauncher = require('browser-launcher2');

export default function openBrowser(browser = 'firefox', failCb) {
  const opts = {
    browser: browser,
    proxy: 'localhost:1338'
  };

  browserLauncher(function(err, launch) { // TODO handle error, #37
    if (err) {
      failCb(err);
    }
    launch('http://www.uxebu.com/', opts, function(err) {
      if (err) {
        failCb(err);
      }
    });
  });
}

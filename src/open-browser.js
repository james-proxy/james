const browserLauncher = require('browser-launcher2');
export default function openBrowser(browser = 'firefox') {
  const opts = {
    browser: browser,
    proxy: 'localhost:1338'
  };

  browserLauncher(function(err, launch) { //TODO handle error, #37
    launch('http://www.uxebu.com/', opts);
  });
}

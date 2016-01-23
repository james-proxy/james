const browserLauncher = require('browser-launcher2');
export default function openBrowser(browser = 'firefox') {
  const opts = {
    browser: browser,
    proxy: "localhost:1338"
  };

  browserLauncher(function(err, launch) {
    if (err) {
      return console.error(err);
    }

    launch('http://www.uxebu.com/', opts, function(err) {
      if (err) {
        console.error(err);
      }
    })
  })
}
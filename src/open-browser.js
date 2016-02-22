import browserLauncher from 'browser-launcher2';

export default function openBrowser(browser = 'firefox', failCb) {
  const opts = {
    browser: browser,
    proxy: 'localhost:1338'
  };

  browserLauncher(function(err, launch) {
    if (err) {
      failCb(err);
    }
    launch('http://james.proxy', opts, function(launchErr) {
      if (launchErr) {
        failCb(launchErr);
      }
    });
  });
}

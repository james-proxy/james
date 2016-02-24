import browserLauncher from 'browser-launcher2';

const defaultOptions = {
  browser: 'firefox',
  proxy: 'localhost:1338'
};

export default function openBrowser(options, failCb) {
  const launchOptions = {
    ...defaultOptions,
    ...options
  };

  browserLauncher(function(err, launch) {
    if (err) {
      failCb(err);
    }
    launch('http://www.uxebu.com/', launchOptions, function(launchErr) {
      if (launchErr) {
        failCb(launchErr);
      }
    });
  });
}

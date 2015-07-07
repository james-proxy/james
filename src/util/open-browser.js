/*eslint-disable */
const chromeLauncher = require('karma-chrome-launcher');
const firefoxLauncher = require('karma-firefox-launcher');
const spawn = require('child_process').spawn;
const tmp = require('tmp');
const env = process.env;
const path = require('path');

import remote from 'remote';

const app = remote.require('app');

export default function openBrowser(browser = 'firefox') {

  const proxy = 'localhost:1338';
  const baseDecorator = function(self) {
    self.id = browser;
    self._getOptions = function(url) {
      return [url]
    };
  };

  const launcher = {
    chrome: {
      create: function(params) {
        var Executable = chromeLauncher['launcher:ChromeCanary'][1];
        return new Executable(baseDecorator, params);
      },
      params: {
        flags: [
          '--user-data-dir=' + app.getPath('userData'),
          '--proxy-server=' + proxy,
          '--no-default-browser-check',
          '--no-first-run',
          '--disable-default-apps',
          '--disable-translate'
        ]
      }
    },
    firefox: {
      create: function(params) {
        var Executable = firefoxLauncher['launcher:Firefox'][1];
        return new Executable(browser, baseDecorator, params, {
          create: function() {
          }
        });
      },
      params: {
        prefs: {
          'network.proxy.http': 'localhost',
          'network.proxy.http_port': '1338',
          'network.proxy.type': '1'
        }
      }
    }
  };


  const params = launcher[browser].params;
  const executable = launcher[browser].create(params);

  ProcessLauncher.call(executable, require('child_process').spawn, require('./temp-dir'), window);

  executable.start();

  app.on('window-all-closed', function() {
    executable.kill();
  });
}

var ProcessLauncher = function(spawn, tempDir, timer) {
  var self = this;
  var onExitCallback;
  var killTimeout = 2000;

  this._tempDir = tempDir.getPath('/karma-' + this.id.toString());

  this.start = function() {
    var url = '';
    tempDir.create(self._tempDir);
    self._start(url)
  };

  this.kill = function() {
    if (!self._process) {
      return;
    }

    onExitCallback = done;
    self._process.kill();
    self._killTimer = timer.setTimeout(self._onKillTimeout, killTimeout)
  };

  this._start = function(url) {
    self._execCommand(self._getCommand(), self._getOptions(url))
  };

  this._getCommand = function() {
    return env[self.ENV_CMD] || self.DEFAULT_CMD[process.platform]
  };

  // Normalize the command, remove quotes (spawn does not like them).
  this._normalizeCommand = function(cmd) {
    if (cmd.charAt(0) === cmd.charAt(cmd.length - 1) && '\'`"'.indexOf(cmd.charAt(0)) !== -1) {
      cmd = cmd.substring(1, cmd.length - 1)
    }

    return path.normalize(cmd)
  };

  this._execCommand = function(cmd, args) {
    if (!cmd) {
      // disable restarting
      self._retryLimit = -1;

      return self._clearTempDirAndReportDone('no binary')
    }

    cmd = this._normalizeCommand(cmd);

    self._process = spawn(cmd, args);

    var errorOutput = '';


    // Node 0.8 does not emit the error
    if (process.versions.node.indexOf('0.8') === 0) {
      self._process.stderr.on('data', function(data) {
        var msg = data.toString();

        if (msg.indexOf('No such file or directory') !== -1) {
          self._retryLimit = -1;
          errorOutput = 'Can not find the binary ' + cmd + '\n\t' +
          'Please set env variable ' + self.ENV_CMD
        } else {
          errorOutput += msg
        }
      })
    }
  };

  this._onProcessExit = function(code, errorOutput) {

    var error = null;

    if (self.state === self.STATE_BEING_CAPTURED) {
      error = 'cannot start'
    }

    if (self.state === self.STATE_CAPTURED) {
      error = 'crashed'
    }

    self._process = null;
    if (self._killTimer) {
      timer.clearTimeout(self._killTimer);
      self._killTimer = null
    }
    self._clearTempDirAndReportDone(error)
  };

  this._clearTempDirAndReportDone = function(error) {
    tempDir.remove(self._tempDir, function() {
      self._done(error)
      if (onExitCallback) {
        onExitCallback()
        onExitCallback = null
      }
    })
  };

  this._onKillTimeout = function() {
    if (self.state !== self.STATE_BEING_KILLED) {
      return
    }

    self._process.kill('SIGKILL');

    // NOTE: https://github.com/karma-runner/karma/pull/1184
    // NOTE: SIGKILL is just a signal.  Processes should never ignore it, but they can.
    // If a process gets into a state where it doesn't respond in a reasonable amout of time
    // Karma should warn, and continue as though the kill succeeded.
    // This a certainly suboptimal, but it is better than having the test harness hang waiting
    // for a zombie child process to exit.
    self._killTimer = timer.setTimeout(function() {
      self._onProcessExit(-1, '')
    }, killTimeout)
  }
};


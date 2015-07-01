var path = require('path');
var fs = require('fs');
var os = require('os');
var rimraf = require('rimraf');

// Node v0.8 uses tmpDir(), v0.10 uses tmpdir().
var TEMP_DIR = os.tmpdir ? os.tmpdir() : os.tmpDir()

module.exports = {
  getPath: function (suffix) {
    return path.normalize(TEMP_DIR + suffix)
  },

  create: function (path) {

    try {
      fs.mkdirSync(path)
    } catch (e) {
      console.warn('Failed to create a temp dir at %s', path)
    }

    return path
  },

  remove: function (path, done) {
    console.debug('Cleaning temp dir %s', path)
    rimraf(path, done)
  }
}

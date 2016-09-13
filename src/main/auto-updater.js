/* eslint-disable no-console */
import GithubReleases from 'electron-gh-releases';
import EventEmitter from 'events';

export default class AutoUpdater extends EventEmitter {
  constructor(options) {
    super();
    this.enabled = options.enabled;
    this.updater = new GithubReleases(options);
    this.downloading = false;
    this.available = false;
    this.pending = false;
    
    this.updater.on('update-downloaded', this.onUpdateDownloaded.bind(this));
  }

  check() {
    if (!this.enabled) {
      console.log('[updater] Update checking disabled.');
      return;
    }

    // already pending install or downloading, noop
    if (this.pending || this.downloading) return;

    console.log('[updater] Checking for updates...');
    this.updater.check(this.onCheckCompleted.bind(this));
  }

  onCheckCompleted(err, available) {
    this.available = available;
    this.emit('finished-check', err, available);
    console.log('[updater] Finished checking for updates', available);

    if (err) {
      console.log('[updater] Error when checking for updates:', err);
      return;
    }
    if (available) {
      // automatically download update when available and no error
      this.download();
    }
  }

  download() {
    if (this.downloading) return; // don't download if already downloading
    console.log('[updater] Downloading update...');
    this.downloading = true;
    this.emit('downloading');
    this.updater.download();
  }

  onUpdateDownloaded(info) {
    const [/* event */, releaseNotes, releaseName, releaseDate, updateURL] = info;
    console.log(`[updater] ${releaseName} (${releaseDate}) is ready to install`);

    // Ready to restart
    this.downloading = false;
    this.pending = true;

    this.emit('downloaded', { releaseNotes, releaseName, releaseDate, updateURL });
  }

  install() {
    if (!this.pending) return; // must not call install if it's not available
    console.log('[updater] Qutting to install update!');
    this.emit('installing');
    this.updater.install(); // quitAndInstall()
  }
}

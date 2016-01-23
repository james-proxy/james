export default class UrlMapper {

  constructor(db, update) {
    this._db = db;
    this._update = update;
    this._map = {};
    this._wildcards = {};

    this._db.find({}, (err, mappedUrls) => {
      mappedUrls.forEach((mappedUrl) => {
        this._addMemoryCopy(mappedUrl);
      });
      update(); // Inform UI that mappings have been loaded
    });
  }

  get(url) {
    const plainUrl = this._map[url];
    if (plainUrl) {
      return plainUrl;
    }

    /*this._wildcards.forEach(function(map) {
      const urlChunks = url.split('/');
      const mapChunks = map.url.split('/');
    });*/
  }

  set(url, newUrl, isLocal, isActive = true) {
    isLocal = !!isLocal;

    // fix the url, because hoxy will add a slash to urls without path..
    if (!isLocal && newUrl.split('/').length === 3 && newUrl.indexOf('?') === -1) {
      newUrl += '/';
    }

    const mappedUrl = {
      url,
      newUrl,
      isLocal,
      isActive
    };

    this._addMemoryCopy(mappedUrl);

    this._db.remove({url}, {multi: true}, () => {
      this._db.insert(mappedUrl, () => {
        this._update();
      });
    });
  }

  isActiveMappedUrl(url) {
    return this.isMappedUrl(url) && this._map[url].isActive;
  }

  isMappedUrl(url) {
    return !!this.get(url);
  }

  toggleActiveState(url) {
    if (!this.isMappedUrl(url)) return;
    this._map[url].isActive = !this._map[url].isActive;
    this._db.update({url}, {$set: {isActive: this._map[url].isActive}}, {}, () => {
      this._update();
    });
  }

  remove(url) {
    this._removeMemoryCopy(url);
    this._db.remove({url}, {multi: true}, () => {
      this._update();
    });
  }

  count() {
    return Object.keys(this._map).length;
  }

  mappings() {
    const list = [];
    for (const key in this._map) {
      if (!this._map.hasOwnProperty(key)) {
        continue;
      }

      // Clone to ensure that consumers can not change internal data
      list.push(JSON.parse(JSON.stringify(this._map[key])));
    }
    return list;
  }

  _addMemoryCopy(mappedUrl) {
    this._removeMemoryCopy(mappedUrl.url);

    if (mappedUrl.url.indexOf('*') === -1) {
      this._map[mappedUrl.url] = mappedUrl;
    }

    this._wildcards[mappedUrl.url] = mappedUrl;
  }

  _removeMemoryCopy(url) {
    delete this._map[url];
    delete this._wildcards[url];
  }

}

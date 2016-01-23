export default class UrlMapper {

  constructor(db, update) {
    this._db = db;
    this._update = update;
    this._map = {};
    this._mapByNewUrl = {};
    this._count = 0;

    this._db.find({}, (err, mappedUrls) => {
      mappedUrls.forEach((mappedUrl) => {
        this._addMemoryCopy(mappedUrl);
      });
      update(); // Inform UI that mappings have been loaded
    });
  }

  get(url) {
    return this._map[url];
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
    return !!this._map[url];
  }

  toggleActiveState(url) {
    if (!this.isMappedUrl(url)) return;
    this._map[url].isActive = !this._map[url].isActive;
    this._db.update({url}, {$set: {isActive: this._map[url].isActive}}, {}, () => {
      this._update();
    });
  }

  removeByNewUrl(newUrl) {
    this._removeMemoryCopyByNewUrl(newUrl);
    this._db.remove({newUrl: newUrl}, {multi: true}, () => {
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
    return this._count;
  }

  mappings() {
    const list = [];
    for (const key in this._map) {
      if (!this._map.hasOwnProperty(key)) {
        continue;
      }
      list.push(this._map[key]);
    }
    return list.map(function(mapping) {

      //Remove db-specific and internal properties that exist on each mapping
      return {
        url: mapping.url,
        newUrl: mapping.newUrl,
        active: mapping.isActive
      }
    });
  }

  _addMemoryCopy(mappedUrl) {
    this._removeMemoryCopy(mappedUrl.url);
    this._count++;
    this._map[mappedUrl.url] = mappedUrl;
    this._mapByNewUrl[mappedUrl.newUrl] = mappedUrl.url;
  }

  _removeMemoryCopyByNewUrl(newUrl) {
    const url = this._mapByNewUrl[newUrl];
    if (!url) return;

    this._count--;

    delete this._map[url];
    delete this._mapByNewUrl[newUrl];
  }

  _removeMemoryCopy(url) {
    if (!this._map[url]) return;

    this._count--;

    const newUrl = this._map[url].newUrl;

    delete this._map[url];
    delete this._mapByNewUrl[newUrl];
  }

}

export default class UrlMapper {

  constructor(db, update) {
    this._db = db;
    this._update = update;
    this._map = {};
    this._mapByNewUrl = {};
    this._count = 0;

    this.getList((err, mappedUrls) => {
      mappedUrls.forEach((mappedUrl) => {
        this._addMemoryCopy(mappedUrl);
      });
    });
  }

  get(url) {
    return this._map[url];
  }

  set(url, newUrl, isLocal) {
    isLocal = !!isLocal;

    // fix the url, because hoxy will add a slash to urls without path..
    if (!isLocal && newUrl.split('/').length === 3 && newUrl.indexOf('?') === -1) {
      newUrl += '/';
    }

    const mappedUrl = {
      url,
      newUrl,
      isLocal
    };

    this._addMemoryCopy(mappedUrl);

    this._db.remove({url}, {multi: true}, () => {
      this._db.insert(mappedUrl, () => {
        this._update();
      });
    });
  }

  isMappedUrl(url) {
    return !!this._map[url];
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

  getCount() {
    return this._count;
  }

  getList(callback) {
    this._db.find({}, callback);
  }

}

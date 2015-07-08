export default class UrlMapper {

  constructor(db, update) {
    this._db = db;
    this._update = update;
    this._map = {};
    this._mapByNewUrl = {};

    this.getList(function(err, mappedUrls) {
      mappedUrls.forEach((mappedUrl) => {
        this._addMemoryCopy(mappedUrl);
      });
    });
  }

  get(url, callback) {
    this._db.find({url: url}, function(err, docs) {
      callback(err, docs[0] || null);
    });
  }

  set(url, newUrl, isLocal) {
    isLocal = !!isLocal;

    // fix the url, because hoxy will add a slash to urls without path..
    if (!isLocal && newUrl.split('/').length === 3 && newUrl.indexOf('?') === -1) {
      newUrl += '/';
    }

    const mappedUrl = {
      url: url,
      newUrl: newUrl,
      isLocal: isLocal
    };

    this._removeMemoryCopy(url);
    this._addMemoryCopy(mappedUrl);

    this._db.remove({url: url}, {multi: true}, () => {
      this._db.insert(mappedUrl, () => {
        this._update();
      });
    });
  }

  isMappedUrl(url) {
    return !!this._map[url];
  }

  _addMemoryCopy(mappedUrl) {
    this._map[mappedUrl.url] = mappedUrl;
    this._mapByNewUrl[mappedUrl.newUrl] = mappedUrl.url;
  }

  _removeMemoryCopyByNewUrl(newUrl) {
    const url = this._mapByNewUrl[newUrl];

    if (!url) return;

    delete this._map[url];
    delete this._mapByNewUrl[newUrl];
  }

  _removeMemoryCopy(url) {
    if (!this._map[url]) return;

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

  getCount(callback) {
    this._db.count({}, function(err, count) {
      callback(err, count);
    });
  }

  getList(callback) {
    this._db.find({}, callback);
  }

}

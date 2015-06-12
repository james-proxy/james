export default class UrlMapper {

  constructor(db, update) {
    this._db = db;
    this._update = update;
  }

  get(url, callback) {
    this._db.find({ url: url }, function (err, docs) {
      callback(err, docs[0] || null);
    });
  }

  set(url, newUrl) {

    // fix the url, because hoxy will add a slash to urls without path..
    if(newUrl.split('/').length === 3 && newUrl.indexOf('?') === -1) {
      newUrl += '/';
    }

    this._db.remove({ newUrl: newUrl }, { multi: true }, () => {
      this._db.insert({
        url: url,
        newUrl: newUrl
      }, () => {
        this._update();
      });
    });
  }

  removeByNewUrl(newUrl) {
    this._db.remove({ newUrl: newUrl }, { multi: true }, () => {
      this._update();
    });
  }

  getCount(callback) {
    db.count({}, function (err, count) {
      callback(err, count);
    });
  }

  getList(callback) {
    this._db.find({}, callback);
  }

}

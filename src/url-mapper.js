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

    const wildcardList = Object.keys(this._wildcards).map((key) => this._wildcards[key]);
    const urlChunks = url.split('/');
    const matches = wildcardList.filter(function(mapping) {
      const chunks = mapping.url.split('/');

      if (urlChunks.length !== chunks.length) {
        return false;
      }

      let isMatch = true;
      chunks.forEach(function(chunk, i) {
        if (chunk === '*') {
          return;
        }

        if (chunk !== urlChunks[i]) {
          isMatch = false;
        }
      });
      return isMatch;
    }).sort(function earliestWildcard(a, b) {
      let aLastPosition = 0;
      let bLastPosition = 0;
      let diff;
      do {
        aLastPosition = a.url.indexOf('*', aLastPosition + 1);
        bLastPosition = b.url.indexOf('*', bLastPosition + 1);

        diff = bLastPosition - aLastPosition;
      } while (diff === 0 && aLastPosition !== -1);

      return diff;
    }).sort(function leastWildcards(a, b) {
      const regex = /[^\*]/g;
      return a.url.replace(regex, '').length - b.url.replace(regex, '').length;
    });

    return matches[0];
  }

  set(url, newUrl, isLocal, isActive = true) {
    isLocal = !!isLocal;

    url = url.trim();
    newUrl = newUrl.trim();

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
    for (const key in this._wildcards) {
      if (!this._wildcards.hasOwnProperty(key)) {
        continue;
      }

      // Clone to ensure that consumers can not change internal data
      list.push(JSON.parse(JSON.stringify(this._wildcards[key])));
    }
    return list;
  }

  _addMemoryCopy(mappedUrl) {
    this._removeMemoryCopy(mappedUrl.url);

    if (mappedUrl.url.indexOf('*') === -1) {
      this._map[mappedUrl.url] = mappedUrl;
      return;
    }

    this._wildcards[mappedUrl.url] = mappedUrl;
  }

  _removeMemoryCopy(url) {
    delete this._map[url];
    delete this._wildcards[url];
  }

}

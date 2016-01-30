import UrlMapper from '../../src/url-mapper.js';

describe('url mapper', function() {
  const update = sinon.spy();

  let urlMapper;
  let dbMock;
  beforeEach(function() {
    dbMock = {
      find: function() {
      },
      insert: function() {
      },
      remove: function() {
      },
      count: function() {
      }
    };

    sinon.stub(dbMock);

    dbMock.remove.callsArg(2);

    urlMapper = new UrlMapper(dbMock, update);
  });

  describe('set', function() {
    it('saves mapped urls to the database', function() {
      const url = 'http://foo.com/bar/baz';
      const newUrl = 'http://foo.com/bar/mapped';
      const isLocal = false;
      const isActive = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );

      expect(dbMock.insert).toHaveBeenCalledWith({
        url,
        newUrl,
        isLocal,
        isActive
      });
    });

    it('removes existing urls before adding them', function() {
      const url = 'http://foo.com/bar/baz';
      const newUrl = 'http://foo.com/bar/mapped';
      const isLocal = false;
      const isActive = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );

      expect(dbMock.remove).toHaveBeenCalledWith({url});
    });

    it('does not add a slash when the path is local', function() {
      const url = 'http://foo.com/bar/baz';
      const newUrl = 'foo/bar';
      const isLocal = true;
      const isActive = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );

      expect(dbMock.insert).toHaveBeenCalledWith({
        url,
        newUrl: 'foo/bar',
        isLocal,
        isActive
      });
    });
  });

  describe('get', function() {
    const isLocal = true;
    const isActive = true;

    const specific = {
      url: 'http://foo.com/bar/baz',
      newUrl: 'foo/specific'
    };

    const oneWildcard = {
      url: 'http://foo.com/*/baz',
      newUrl: 'foo/oneWildcard'
    };

    const multiWildcard = {
      url: 'http://foo.com/*/*',
      newUrl: 'foo/multiwildcard'
    };

    function check(testUrl, expected) {
      const {url, newUrl} = expected;
      const mappedUrl = urlMapper.get(testUrl);
      expect(mappedUrl).toEqual({
        url,
        newUrl,
        isLocal,
        isActive
      });
    }

    function set(mapping) {
      urlMapper.set(
        mapping.url,
        mapping.newUrl,
        isLocal,
        isActive
      );
    }

    it('returns undefined if no matching maps', function() {
      set(specific);
      set(oneWildcard);
      set(multiWildcard);
      expect(urlMapper.get('http://dunx')).toEqual(undefined);
    });

    it('matches plain urls', function() {
      set(specific);
      check(specific.url, specific);
    });

    it('matches, if no trailing slash', function() {
      const noTrailing = {
        url: 'http://foo.com',
        newUrl: 'newUrl'
      };

      set(noTrailing);
      check('http://foo.com', noTrailing);
      check('http://foo.com/', noTrailing);
    });

    it('matches, if trailing slash', function() {
      const trailingSlashes = {
        url: 'http://foo.com/',
        newUrl: 'newUrl'
      };

      set(trailingSlashes);
      check('http://foo.com', trailingSlashes);
      check('http://foo.com/', trailingSlashes);
    });

    it('matches wildcards', function() {
      set(oneWildcard);
      check('http://foo.com/1/baz', oneWildcard);
    });

    it('doesn\'t match wildcard regardless of trailing slash or not', function() {
      set({
        url: 'http://foo.com/*',
        newUrl: 'newUrl'
      });

      expect(urlMapper.get('http://foo.com')).toEqual(undefined);
      expect(urlMapper.get('http://foo.com/')).toEqual(undefined);
    });

    it('matches multi-wildcards', function() {
      set(multiWildcard);
      check('http://foo.com/2/bork', multiWildcard);
    });

    it('matches most-specific url', function() {
      set(specific);
      set(oneWildcard);
      set(multiWildcard);
      check('http://foo.com/bar/baz', specific);
      check('http://foo.com/derp/baz', oneWildcard);
      check('http://foo.com/derp/any', multiWildcard);
    });

    it('when the same amount of wildcards, matches the one with the longer direct-match on the left', function() {
      const early = {
        url: 'http://foo.com/*/spaghetti',
        newUrl: 'foo/earlyWildcard'
      };

      const late = {
        url: 'http://foo.com/bar/*',
        newUrl: 'foo/lateWildcard'
      };

      set(early);
      set(late);
      check('http://foo.com/bar/spaghetti', late);
    });

    it('should do longer direct-match, even when first wildcards are in same position', function() {
      const earlyMulti = {
        url: 'http://bar.com/*/*/baz',
        newUrl: 'bar/earlyMultiWildcard'
      };

      const lateMulti = {
        url: 'http://bar.com/*/foo/*',
        newUrl: 'bar/lateMultiWildcard'
      };

      set(earlyMulti);
      set(lateMulti);
      check('http://bar.com/yolo/foo/baz', lateMulti);
    });
  });

  describe('remove', function() {
    let url;
    let newUrl;
    let isLocal;
    const isActive = true;
    beforeEach(function() {
      url = 'http://foo.com/bar/baz';
      newUrl = 'foo/bar';
      isLocal = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
    });

    it('removes mappings', function() {
      urlMapper.remove(url);
      const mappedUrl = urlMapper.get(url);
      expect(mappedUrl).toEqual(undefined);
    });
  });

  describe('isMappedUrl', function() {
    let url;
    let newUrl;
    let isLocal;
    let isActive;

    beforeEach(function() {
      url = 'http://foo.com/bar/baz';
      newUrl = 'foo/bar';
      isLocal = true;
      isActive = true;
    });

    it('returns false if the given `url` is not mapped', function() {
      url = 'http://not.mapped.com/';
      expect(urlMapper.isMappedUrl(url)).toBe(false);
    });

    it('returns true if the given `url` is mapped', function() {
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      expect(urlMapper.isMappedUrl(url)).toBe(true);
    });
  });

  describe('isActiveMappedUrl', function() {
    let url;
    let newUrl;
    let isLocal;
    let isActive;

    beforeEach(function() {
      url = 'http://foo.com/bar/baz';
      newUrl = 'foo/bar';
      isLocal = true;
      isActive = true;
    });

    it('returns false if the given `url` is not mapped', function() {
      url = 'http://not.mapped.com/';
      expect(urlMapper.isActiveMappedUrl(url)).toBe(false);
    });

    it('returns false if the given `url` is mapped but inactive', function() {
      isActive = false;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      expect(urlMapper.isActiveMappedUrl(url)).toBe(false);
    });

    it('returns true if the given `url` is mapped and active', function() {
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      expect(urlMapper.isActiveMappedUrl(url)).toBe(true);
    });
  });

  describe('count', function() {
    let url;
    let newUrl;
    let isLocal;
    const isActive = true;
    beforeEach(function() {
      url = 'http://foo.com/bar/baz';
      newUrl = 'foo/bar';
      isLocal = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
    });

    it('returns the number of urlMappings', function() {
      const count = urlMapper.count();
      expect(count).toEqual(1);
    });

    it('returns 1 after adding the same mapping twice', function() {
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      const count = urlMapper.count();
      expect(count).toEqual(1);
    });

    it('returns 0 after removing a mapping', function() {
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      urlMapper.remove(url);
      const count = urlMapper.count();
      expect(count).toEqual(0);
    });
  });
  describe('mappings', function() {
    let mappings;
    const first = {
      url: 'http://foo.com/bar/baz',
      newUrl: 'foo/bar',
      isLocal: true,
      isActive: true
    };
    const second = {
      url: 'http://foo.com/bar/baz2',
      newUrl: 'foo/bar2',
      isLocal: true,
      isActive: false
    };

    beforeEach(function() {
      urlMapper.set(
        first.url,
        first.newUrl,
        first.isLocal,
        first.isActive
      );
      urlMapper.set(
        second.url,
        second.newUrl,
        first.isLocal,
        second.isActive
      );
      mappings = urlMapper.mappings();
    });

    it('returns a list of all mappings, regardless of if active', function() {
      expect(mappings.length).toEqual(2);
    });

    it('should provide match url, newUrl url, and whether or not is active', function() {
      const expected = JSON.stringify([first, second]);
      expect(JSON.stringify(mappings)).toEqual(expected);
    });

    it('should return a clone, so that mappings can\'t be tampered with', function() {
      mappings[0].url = 'http://jookd.net';
      const unwanted = JSON.stringify(mappings);
      const newMappings = urlMapper.mappings();
      expect(JSON.stringify(newMappings)).not.toEqual(unwanted);
    });
  });
});

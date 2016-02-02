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
  });

  describe('get', function() {
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

    it('returns undefined if no matching maps', function() {
      urlMapper.set(
        specific.url,
        specific.newUrl,
        true,
        true
      );
      urlMapper.set(
        oneWildcard.url,
        oneWildcard.newUrl,
        true,
        true
      );
      urlMapper.set(
        multiWildcard.url,
        multiWildcard.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://dunx')).toEqual(undefined);
    });

    it('matches plain urls', function() {
      urlMapper.set(
        specific.url,
        specific.newUrl,
        true,
        true
      );
      expect(urlMapper.get(specific.url).newUrl).toEqual(specific.newUrl);
    });

    it('matches, if no trailing slash', function() {
      const noTrailing = {
        url: 'http://foo.com',
        newUrl: 'newUrl'
      };

      urlMapper.set(
        noTrailing.url,
        noTrailing.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://foo.com').newUrl).toEqual(noTrailing.newUrl);
      expect(urlMapper.get('http://foo.com/').newUrl).toEqual(noTrailing.newUrl);
    });

    it('matches, if trailing slash', function() {
      const trailingSlashes = {
        url: 'http://foo.com/',
        newUrl: 'newUrl'
      };

      urlMapper.set(
        trailingSlashes.url,
        trailingSlashes.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://foo.com').newUrl).toEqual(trailingSlashes.newUrl);
      expect(urlMapper.get('http://foo.com/').newUrl).toEqual(trailingSlashes.newUrl);
    });

    it('matches wildcards', function() {
      urlMapper.set(
        oneWildcard.url,
        oneWildcard.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://foo.com/1/baz').newUrl).toEqual(oneWildcard.newUrl);
    });

    it('doesn\'t match wildcard regardless of trailing slash or not', function() {
      urlMapper.set(
        {
          url: 'http://foo.com/*',
          newUrl: 'newUrl'
        }.url,
        {
          url: 'http://foo.com/*',
          newUrl: 'newUrl'
        }.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://foo.com')).toEqual(undefined);
      expect(urlMapper.get('http://foo.com/')).toEqual(undefined);
    });

    it('matches multi-wildcards', function() {
      urlMapper.set(
        multiWildcard.url,
        multiWildcard.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://foo.com/2/bork').newUrl).toEqual(multiWildcard.newUrl);
    });

    it('matches most-specific url', function() {
      urlMapper.set(
        specific.url,
        specific.newUrl,
        true,
        true
      );
      urlMapper.set(
        oneWildcard.url,
        oneWildcard.newUrl,
        true,
        true
      );
      urlMapper.set(
        multiWildcard.url,
        multiWildcard.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://foo.com/bar/baz').newUrl).toEqual(specific.newUrl);
      expect(urlMapper.get('http://foo.com/derp/baz').newUrl).toEqual(oneWildcard.newUrl);
      expect(urlMapper.get('http://foo.com/derp/any').newUrl).toEqual(multiWildcard.newUrl);
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

      urlMapper.set(
        early.url,
        early.newUrl,
        true,
        true
      );
      urlMapper.set(
        late.url,
        late.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://foo.com/bar/spaghetti').newUrl).toEqual(late.newUrl);
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

      urlMapper.set(
        earlyMulti.url,
        earlyMulti.newUrl,
        true,
        true
      );
      urlMapper.set(
        lateMulti.url,
        lateMulti.newUrl,
        true,
        true
      );
      expect(urlMapper.get('http://bar.com/yolo/foo/baz').newUrl).toEqual(lateMulti.newUrl);
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
    const url = 'http://foo.com/bar/baz';
    const newUrl = 'foo/bar';
    beforeEach(function() {
      urlMapper.set(
        url,
        newUrl,
        true,
        true
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
        true,
        true
      );
      const count = urlMapper.count();
      expect(count).toEqual(1);
    });

    it('returns 0 after removing a mapping', function() {
      urlMapper.set(
        url,
        newUrl,
        true,
        true
      );
      urlMapper.remove(url);
      const count = urlMapper.count();
      expect(count).toEqual(0);
    });
  });
  describe('mappings', function() {
    let mappings;

    beforeEach(function() {
      urlMapper.set(
        'http://foo.com/bar/baz',
        'foo/bar',
        true,
        true
      );
      urlMapper.set(
        'http://foo.com/bar/baz2',
        'foo/bar2',
        true,
        false
      );
      mappings = urlMapper.mappings();
    });

    it('returns a list of all mappings, regardless of if active', function() {
      expect(mappings.length).toEqual(2);
    });

    it('should return a clone, so that mappings can\'t be tampered with', function() {
      mappings[0].url = 'http://jookd.net';
      const unwanted = JSON.stringify(mappings);
      const newMappings = urlMapper.mappings();
      expect(JSON.stringify(newMappings)).not.toEqual(unwanted);
    });
  });
});

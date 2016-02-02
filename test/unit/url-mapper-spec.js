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
      const url = 'foo.com/bar/baz';
      const newUrl = 'foo.com/bar/mapped';
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
      const url = 'foo.com/bar/baz';
      const newUrl = 'foo.com/bar/mapped';
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

  describe('protocol-removal', function() {
    const newUrl = 'newUrl';
    const isLocal = true;
    const isActive = true;
    const expectedMapping = {
      url: 'foo.com/bar',
      newUrl: newUrl,
      isLocal: isLocal,
      isActive: isActive
    };

    it('should work for http sources', function() {
      urlMapper.set(
        'http://foo.com/bar',
        newUrl
      );
      expect(dbMock.insert).toHaveBeenCalledWith(expectedMapping);
    });

    it('should work for https sources', function() {
      urlMapper.set(
        'https://foo.com/bar',
        newUrl
      );
      expect(dbMock.insert).toHaveBeenCalledWith(expectedMapping);
    });

    it('should apply to requests coming in', function() {
      urlMapper.set(
        'foo.com/bar',
        newUrl
      );

      expect(urlMapper.get('http://foo.com/bar')).toEqual(expectedMapping);
    });

    it('should not remove the protocol from the destination url', function() {
      const url = 'foo.com/bar';
      const newUrl = 'http://new.com';
      const expected = {
        url: url,
        newUrl: newUrl,
        isLocal: true,
        isActive: true
      };

      urlMapper.set(
        url,
        'http://new.com'
      );
      expect(dbMock.insert).toHaveBeenCalledWith(expected);
    });
  });

  describe('get', function() {
    const specific = {
      url: 'foo.com/bar/baz',
      newUrl: 'foo/specific',
      isLocal: true,
      isActive: true
    };

    const oneWildcard = {
      url: 'foo.com/*/baz',
      newUrl: 'foo/oneWildcard',
      isLocal: true,
      isActive: true
    };

    const multiWildcard = {
      url: 'foo.com/*/*',
      newUrl: 'foo/multiwildcard',
      isLocal: true,
      isActive: true
    };

    it('returns undefined if no matching maps', function() {
      expect(urlMapper.get('dunx')).toEqual(undefined);
    });

    it('matches plain urls', function() {
      urlMapper.set(
        specific.url,
        specific.newUrl
      );
      expect(urlMapper.get(specific.url).newUrl).toEqual(specific.newUrl);
    });

    it('matches, if no trailing slash', function() {
      const noTrailing = {
        url: 'foo.com',
        newUrl: 'newUrl'
      };

      urlMapper.set(
        noTrailing.url,
        noTrailing.newUrl
      );
      expect(urlMapper.get('foo.com').newUrl).toEqual(noTrailing.newUrl);
      expect(urlMapper.get('foo.com/').newUrl).toEqual(noTrailing.newUrl);
    });

    it('matches, if trailing slash', function() {
      const trailingSlashes = {
        url: 'foo.com/',
        newUrl: 'newUrl'
      };

      urlMapper.set(
        trailingSlashes.url,
        trailingSlashes.newUrl
      );
      expect(urlMapper.get('foo.com').newUrl).toEqual(trailingSlashes.newUrl);
      expect(urlMapper.get('foo.com/').newUrl).toEqual(trailingSlashes.newUrl);
    });

    it('matches wildcards', function() {
      urlMapper.set(
        oneWildcard.url,
        oneWildcard.newUrl
      );

      expect(urlMapper.get('foo.com/1/baz')).toEqual(oneWildcard);
    });

    it('doesn\'t match wildcard regardless of trailing slash or not', function() {
      urlMapper.set(
        'foo.com/*',
        'newUrl'
      );
      expect(urlMapper.get('foo.com')).toEqual(undefined);
      expect(urlMapper.get('foo.com/')).toEqual(undefined);
    });

    it('matches multi-wildcards', function() {
      urlMapper.set(
        multiWildcard.url,
        multiWildcard.newUrl
      );
      expect(urlMapper.get('foo.com/2/bork')).toEqual(multiWildcard);
    });

    it('matches most-specific url', function() {
      urlMapper.set(
        specific.url,
        specific.newUrl
      );
      urlMapper.set(
        oneWildcard.url,
        oneWildcard.newUrl
      );
      urlMapper.set(
        multiWildcard.url,
        multiWildcard.newUrl
      );

      expect(urlMapper.get('foo.com/bar/baz')).toEqual(specific);
      expect(urlMapper.get('foo.com/derp/baz')).toEqual(oneWildcard);
      expect(urlMapper.get('foo.com/derp/any')).toEqual(multiWildcard);
    });

    it('when the same amount of wildcards, matches the one with the longer direct-match on the left', function() {
      const early = {
        url: 'foo.com/*/spaghetti',
        newUrl: 'foo/earlyWildcard',
        isLocal: true,
        isActive: true
      };

      const late = {
        url: 'foo.com/bar/*',
        newUrl: 'foo/lateWildcard',
        isLocal: true,
        isActive: true
      };

      urlMapper.set(
        early.url,
        early.newUrl
      );
      urlMapper.set(
        late.url,
        late.newUrl
      );
      expect(urlMapper.get('foo.com/bar/spaghetti')).toEqual(late);
    });

    it('should do longer direct-match, even when first wildcards are in same position', function() {
      const earlyMulti = {
        url: 'bar.com/*/*/baz',
        newUrl: 'bar/earlyMultiWildcard',
        isLocal: true,
        isActive: true
      };

      const lateMulti = {
        url: 'bar.com/*/foo/*',
        newUrl: 'bar/lateMultiWildcard',
        isLocal: true,
        isActive: true
      };

      urlMapper.set(
        earlyMulti.url,
        earlyMulti.newUrl
      );
      urlMapper.set(
        lateMulti.url,
        lateMulti.newUrl
      );
      expect(urlMapper.get('bar.com/yolo/foo/baz')).toEqual(lateMulti);
    });
  });

  describe('remove', function() {
    let url;
    let newUrl;
    beforeEach(function() {
      url = 'foo.com/bar/baz';
      newUrl = 'foo/bar';
      urlMapper.set(
        url,
        newUrl
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

    beforeEach(function() {
      url = 'foo.com/bar/baz';
      newUrl = 'foo/bar'
    });

    it('returns false if the given `url` is not mapped', function() {
      url = 'not.mapped.com/';
      expect(urlMapper.isMappedUrl(url)).toBe(false);
    });

    it('returns true if the given `url` is mapped', function() {
      urlMapper.set(
        url,
        newUrl
      );
      expect(urlMapper.isMappedUrl(url)).toBe(true);
    });
  });

  describe('isActiveMappedUrl', function() {
    const newUrl = 'foo/bar';
    const isLocal = true;
    let url;
    let isActive;

    beforeEach(function() {
      url = 'foo.com/bar/baz';
      isActive = true;
    });

    it('returns false if the given `url` is not mapped', function() {
      url = 'not.mapped.com/';
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
    const url = 'foo.com/bar/baz';
    const newUrl = 'foo/bar';
    beforeEach(function() {
      urlMapper.set(
        url,
        newUrl
      );
    });

    it('returns the number of urlMappings', function() {
      const count = urlMapper.count();
      expect(count).toEqual(1);
    });

    it('returns 1 after adding the same mapping twice', function() {
      urlMapper.set(
        url,
        newUrl
      );
      const count = urlMapper.count();
      expect(count).toEqual(1);
    });

    it('returns 0 after removing a mapping', function() {
      urlMapper.set(
        url,
        newUrl
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
        'foo.com/active',
        'foo/active',
        true,
        true
      );
      urlMapper.set(
        'foo.com/inactive',
        'foo/inactive',
        true,
        false
      );
      mappings = urlMapper.mappings();
    });

    it('returns a list of all mappings, regardless of if active', function() {
      expect(mappings.length).toEqual(2);
    });

    it('should return a clone, so that mappings can\'t be tampered with', function() {
      mappings[0].url = 'jookd.net';
      const unwanted = JSON.stringify(mappings);
      const newMappings = urlMapper.mappings();
      expect(JSON.stringify(newMappings)).not.toEqual(unwanted);
    });
  });
});

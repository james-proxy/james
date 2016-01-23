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

    it('adds a slash to `newUrl` when the url has no path and no slash at the end', function() {
      const url = 'http://foo.com/bar/baz';
      const newUrl = 'http://foo.com';
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
        newUrl: 'http://foo.com/',
        isLocal,
        isActive
      });
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

    it('stores the mappings in the memory', function() {
      const mappedUrl = urlMapper.get(url);
      expect(mappedUrl).toEqual({
        url,
        newUrl,
        isLocal,
        isActive
      });
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

    it('removes mappings by passing the `newUrl`', function() {
      urlMapper.removeByNewUrl(newUrl);
      const mappedUrl = urlMapper.get(url);
      expect(mappedUrl).toEqual(undefined);
    });

    it('removes mappings by passing the `removeByNewUrl`', function() {
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

    it('returns 0 after removing a mapping by new url', function() {
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      urlMapper.removeByNewUrl(newUrl);
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

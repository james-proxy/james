import assert from 'assert';
import sinon from 'sinon';

import UrlMapper from '../../../src/common/service/url-mapper.js';

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
      const isMerge = false;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive,
        isMerge
      );

      assert(dbMock.insert.calledWith({
        url,
        newUrl,
        isLocal,
        isActive,
        isMerge
      }));
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

      assert(dbMock.remove.calledWith({url}));
    });

    it('does not add a mapping to the db when url is an empty string', function() {
      const url = '';
      const newUrl = 'foo.com/bar/mapped';
      const isLocal = false;
      const isActive = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );

      assert(dbMock.insert.notCalled);
    });

    it('does not add a mapping to the db when url is an empty string', function() {
      const url = 'foo.com';
      const newUrl = '';
      const isLocal = false;
      const isActive = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );

      assert(dbMock.insert.notCalled);
    });
  });

  describe('protocol-removal', function() {
    const newUrl = 'http://new.com';
    const expectedMapping = {
      url: 'foo.com/bar',
      newUrl: newUrl,
      isLocal: true,
      isActive: true,
      isMerge: false
    };

    it('should not remove the protocol from the destination url', function() {
      urlMapper.set(
        'foo.com/bar',
        newUrl
      );
      assert(dbMock.insert.calledWith(expectedMapping));
    });

    it('should work for http sources', function() {
      urlMapper.set(
        'http://foo.com/bar',
        newUrl
      );
      assert(dbMock.insert.calledWith(expectedMapping));
    });

    it('should work for https sources', function() {
      urlMapper.set(
        'https://foo.com/bar',
        newUrl
      );
      assert(dbMock.insert.calledWith(expectedMapping));
    });

    it('should apply to requests coming in', function() {
      urlMapper.set(
        expectedMapping.url,
        expectedMapping.newUrl
      );

      assert(urlMapper.get('http://foo.com/bar').newUrl === expectedMapping.newUrl);
    });
  });

  describe('get', function() {
    const specific = {
      url: 'foo.com/bar/baz',
      newUrl: 'foo/specific'
    };

    const oneWildcard = {
      url: 'foo.com/*/baz',
      newUrl: 'foo/oneWildcard'
    };

    const multiWildcard = {
      url: 'foo.com/*/*',
      newUrl: 'foo/multiwildcard'
    };

    it('returns undefined if no matching maps', function() {
      assert(urlMapper.get('dunx') === undefined);
    });

    it('matches plain urls', function() {
      urlMapper.set(
        specific.url,
        specific.newUrl
      );
      assert(urlMapper.get(specific.url).newUrl === specific.newUrl);
    });

    it('matches, if no trailing slash', function() {
      const url = 'foo.com';
      const newUrl = 'newUrl';

      urlMapper.set(
        url,
        newUrl
      );
      assert(urlMapper.get('foo.com').newUrl === newUrl);
      assert(urlMapper.get('foo.com/').newUrl === newUrl);
    });

    it('matches, if trailing slash', function() {
      const url = 'foo.com/';
      const newUrl = 'newUrl';

      urlMapper.set(
        url,
        newUrl
      );
      assert(urlMapper.get('foo.com').newUrl === newUrl);
      assert(urlMapper.get('foo.com/').newUrl === newUrl);
    });

    it('matches wildcards', function() {
      urlMapper.set(
        oneWildcard.url,
        oneWildcard.newUrl
      );

      assert(urlMapper.get('foo.com/1/baz').newUrl === oneWildcard.newUrl);
    });

    it('doesn\'t match ending wildcard regardless of request\'s trailing slash or not', function() {
      urlMapper.set(
        'foo.com/*',
        'newUrl'
      );
      assert(urlMapper.get('foo.com') === undefined);
      assert(urlMapper.get('foo.com/') === undefined);
    });

    it('matches multi-wildcards', function() {
      urlMapper.set(
        multiWildcard.url,
        multiWildcard.newUrl
      );
      assert(urlMapper.get('foo.com/2/bork').newUrl === multiWildcard.newUrl);
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

      assert(urlMapper.get('foo.com/bar/baz').newUrl === specific.newUrl);
      assert(urlMapper.get('foo.com/derp/baz').newUrl === oneWildcard.newUrl);
      assert(urlMapper.get('foo.com/derp/any').newUrl === multiWildcard.newUrl);
    });

    it('when the same amount of wildcards, matches the one with the longer direct-match on the left', function() {
      const early = {
        url: 'foo.com/*/spaghetti',
        newUrl: 'foo/earlyWildcard'
      };

      const late = {
        url: 'foo.com/bar/*',
        newUrl: 'foo/lateWildcard'
      };

      urlMapper.set(
        early.url,
        early.newUrl
      );
      urlMapper.set(
        late.url,
        late.newUrl
      );
      assert(urlMapper.get('foo.com/bar/spaghetti').newUrl === late.newUrl);
    });

    it('should do longer direct-match, even when first wildcards are in same position', function() {
      const earlyMulti = {
        url: 'bar.com/*/*/baz',
        newUrl: 'bar/earlyMultiWildcard'
      };

      const lateMulti = {
        url: 'bar.com/*/foo/*',
        newUrl: 'bar/lateMultiWildcard'
      };

      urlMapper.set(
        earlyMulti.url,
        earlyMulti.newUrl
      );
      urlMapper.set(
        lateMulti.url,
        lateMulti.newUrl
      );
      assert(urlMapper.get('bar.com/yolo/foo/baz').newUrl === lateMulti.newUrl);
    });
  });

  describe('remove', function() {
    it('removes mappings', function() {
      const url = 'foo.com/bar/baz';

      urlMapper.set(url, 'newUrl');
      urlMapper.remove(url);
      assert(urlMapper.get(url) === undefined);
    });
  });

  describe('isMappedUrl', function() {
    it('returns false if the given `url` is not mapped', function() {
      assert(urlMapper.isMappedUrl('not.mapped.com/') === false);
    });

    it('returns true if the given `url` is mapped', function() {
      const url = 'foo.com';
      urlMapper.set(
        url,
        'newUrl'
      );
      assert(urlMapper.isMappedUrl(url) === true);
    });
  });

  describe('isActiveMappedUrl', function() {
    const url = 'foo.com/bar/baz';
    const newUrl = 'foo/bar';
    const isLocal = true;
    let isActive;

    it('returns false if the given `url` is not mapped', function() {
      assert(urlMapper.isActiveMappedUrl('not.mapped.com/') === false);
    });

    it('returns false if the given `url` is mapped but inactive', function() {
      isActive = false;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      assert(urlMapper.isActiveMappedUrl(url) === false);
    });

    it('returns true if the given `url` is mapped and active', function() {
      isActive = true;
      urlMapper.set(
        url,
        newUrl,
        isLocal,
        isActive
      );
      assert(urlMapper.isActiveMappedUrl(url) === true);
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
      assert(urlMapper.count() === 1);
    });

    it('returns 1 after adding the same mapping twice', function() {
      urlMapper.set(
        url,
        newUrl
      );
      assert(urlMapper.count() === 1);
    });

    it('returns 0 after removing a mapping', function() {
      urlMapper.set(
        url,
        newUrl
      );
      urlMapper.remove(url);
      assert(urlMapper.count() === 0);
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
      assert(mappings.length === 2);
    });

    it('should return a clone, so that mappings can\'t be tampered with', function() {
      mappings[0].url = 'jookd.net';
      const unwanted = JSON.stringify(mappings);
      const newMappings = urlMapper.mappings();
      assert(JSON.stringify(newMappings) !== unwanted);
    });
  });
});

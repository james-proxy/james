import assert from 'assert';
import sinon from 'sinon';

import Proxy from '../../../src/common/service/proxy.js';

describe('Proxy', function() {
  const update = () => {

  };

  const config = {
    maxLogEntries: 1000
  };
  const urlMapper = {
    get: sinon.stub(),
    isMappedUrl: sinon.stub(),
    isActiveMappedUrl: sinon.stub()
  };

  const isCachingEnabled = sinon.stub().returns(false);

  let proxy;
  let hoxyInstanceMock;
  let generateRequest;
  let cycle;

  beforeEach(function() {
    const callbacksRequest = [];
    const callbacksResponseSent = [];
    const callbacksResponse = [];

    const intercept = function(nameOrObj, callback) {
      if (typeof nameOrObj === 'string') {
        if (nameOrObj === 'request') {
          callbacksRequest.push(callback);
        } else if (nameOrObj === 'response-sent') {
          callbacksResponseSent.push(callback);
        } else if (nameOrObj === 'response') {
          callbacksResponse.push(callback);
        }
        return;
      }
      if (typeof nameOrObj === 'object') {
        if (nameOrObj.phase === 'request') {
          callbacksRequest.push(callback);
        } else if (nameOrObj.phase === 'response-sent') {
          callbacksResponseSent.push(callback);
        } else if (nameOrObj.phase === 'response') {
          callbacksResponse.push(callback);
        }
        return;
      }
      throw new Error('Invalid type passed to intercept');
    };
    hoxyInstanceMock = {
      intercept: sinon.spy(intercept)
    };

    cycle = {
      serve: sinon.spy()
    };

    urlMapper.isMappedUrl.returns(false);

    const createHoxy = () => {
      return hoxyInstanceMock;
    };

    let requestCount = 0;

    generateRequest = () => {
      const id = 'url' + requestCount++;
      const request = {
        fullUrl: function() {
        },
        headers: {
          'if-modified-since': 'foo',
          'if-none-match': 'foo',
          'pragma': 'foo',
          'cache-control': 'foo',
          'last-modified': 'foo',
          'expires': 'foo',
          'etag': 'foo'
        }
      };

      sinon.stub(request, 'fullUrl').returns(id);

      const response = request;
      callbacksRequest.forEach((cb) => {
        cb(request, response, cycle);
      });
      callbacksResponse.forEach((cb) => {
        cb(request, response, cycle);
      });
      callbacksResponseSent.forEach((cb) => {
        cb(request, response, cycle);
      });

      return request;
    };

    proxy = new Proxy(update, config, urlMapper, createHoxy, isCachingEnabled);
  });

  describe('getRequests', function() {
    it('has no requests on startup', function() {
      const requests = proxy.getRequests();
      assert.equal(requests.length, 0);
    });

    describe('after intercepted requests', function() {
      beforeEach(function() {
        generateRequest();
      });

      it('returns a list of 1 request', function() {
        const requests = proxy.getRequests();
        assert(requests.length === 1);
      });

      it('returns a list of 20 after intercepting 20 requests', function() {
        // Only generates 19 requests and expects 20 because of the beforeEach()
        for (let i = 0; i < 19; i++) {
          generateRequest();
        }

        const requests = proxy.getRequests();
        assert(requests.length === 20);
      });
    });
  });

  describe('request mapping', function() {
    it('maps requests', function() {
      urlMapper.isMappedUrl.returns(true);
      urlMapper.isActiveMappedUrl.returns(true);
      urlMapper.get.returns({
        url: 'url0',
        newUrl: 'mappedUrl',
        isLocal: false
      });

      const request = generateRequest();

      assert(request.fullUrl.calledWith('mappedUrl'));
    });

    it('maps requests to local files', function() {
      urlMapper.isMappedUrl.returns(true);
      urlMapper.isActiveMappedUrl.returns(true);
      urlMapper.get.returns({
        url: 'url0',
        newUrl: '/local/path',
        isLocal: true
      });

      generateRequest();

      assert(cycle.serve.calledWith({
        path: '/local/path'
      }));
    });
  });

  describe('hoxy integration', function() {
    it('registers a callback to intercept requests', function() {
      assert(hoxyInstanceMock.intercept.calledWith({phase: 'request', as: 'string'}));
    });
    it('registers a callback to intercept responses', function() {
      assert(hoxyInstanceMock.intercept.calledWith('response-sent'));
    });
    it('registers a callback to intercept responses', function() {
      assert(hoxyInstanceMock.intercept.calledWith({phase: 'response', as: 'string'}));
    });
  });

  describe('caching', function() {
    it('removes the header `if-modified-since`', function() {
      const response = generateRequest();
      assert(response.headers['if-modified-since'] === undefined);
    });
    it('removes the header `if-none-match`', function() {
      const response = generateRequest();
      assert(response.headers['if-none-match'] === undefined);
    });
    it('removes the header `etag`', function() {
      const response = generateRequest();
      assert(response.headers.etag === undefined);
    });
    it('removes the header `last-modified`', function() {
      const response = generateRequest();
      assert(response.headers['last-modified'] === undefined);
    });
    it('changes the header `pragma` to `no-cache`', function() {
      const response = generateRequest();
      assert(response.headers.pragma === 'no-cache');
    });
    it('changes the header `cache-control` to `no-cache`', function() {
      const response = generateRequest();
      assert(response.headers['cache-control'] === 'no-cache');
    });
    it('changes the header `expires` to `0`', function() {
      const response = generateRequest();
      assert(response.headers.expires === '0');
    });
  });

  describe('clear', function() {
    it('removes all requests', function() {
      generateRequest();
      proxy.clear();
      assert(proxy.getRequests().length === 0);
    });
  });
});

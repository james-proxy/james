import Proxy from '../../../src/service/proxy.js';

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
  let callbacksRequest;
  let callbacksResponseSent;
  let callbacksResponse;
  let generateRequest;
  let cycle;

  beforeEach(function() {
    callbacksRequest = [];
    callbacksResponseSent = [];
    callbacksResponse = [];

    const intercept = function(name, callback) {
      if (name === 'request') {
        return callbacksRequest.push(callback);
      }
      if (name === 'response-sent') {
        return callbacksResponseSent.push(callback);
      }
      if (name === 'response') {
        return callbacksResponse.push(callback);
      }
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

  describe('getRequestData', function() {
    it('has no requests on startup', function() {
      const requestData = proxy.getRequestData();

      expect(requestData).toEqual({
        requests: [],
        totalCount: 0,
        filteredCount: 0
      });
    });

    describe('after intercepted requests', function() {
      beforeEach(function() {
        generateRequest();
      });

      it('returns a totalCount value of 1', function() {
        const requestData = proxy.getRequestData();
        expect(requestData.totalCount).toEqual(1);
      });

      it('returns a filteredCount value of 1', function() {
        const requestData = proxy.getRequestData();
        expect(requestData.totalCount).toEqual(1);
      });

      it('returns a totalCount value of 20 after intercepting 20 requests', function() {
        for (let i = 0; i < 19; i++) {
          generateRequest();
        }

        const requestData = proxy.getRequestData();
        expect(requestData.totalCount).toEqual(20);
      });

      it('filters by url and returns an array only with matching requests', function() {
        generateRequest();
        const filter = 'url1';
        const requestData = proxy.getRequestData(null, null, filter);
        expect(requestData.requests[0].request.fullUrl()).toEqual('url1');
      });

      it('shows the correct totalCount even when requests are filtered', function() {
        generateRequest();
        const filter = 'url1';
        const requestData = proxy.getRequestData(null, null, filter);
        expect(requestData.totalCount).toEqual(2);
      });

      it('shows the correct filteredCount when requests are filtered', function() {
        generateRequest();
        const filter = 'url1';
        const requestData = proxy.getRequestData(null, null, filter);
        expect(requestData.filteredCount).toEqual(1);
      });

      it('limits the result when the limit argument is passed', function() {
        generateRequest();
        const limit = 1;
        const requestData = proxy.getRequestData(limit, null, null);
        expect(requestData.requests.length).toEqual(1);
      });

      it('limits the result when a starting point (from) is passed', function() {
        generateRequest();
        const fromIndex = 1;
        const requestData = proxy.getRequestData(null, fromIndex, null);
        expect(requestData.requests.length).toEqual(1);
      });

      it('limits the result by starting point (from) and limit', function() {
        generateRequest();
        generateRequest();
        generateRequest();
        const fromIndex = 1;
        const limit = 2;
        const requestData = proxy.getRequestData(limit, fromIndex, null);
        expect(requestData.requests.length).toEqual(2);
      });

      it('limits the result by starting point (from) and limit and filter', function() {
        generateRequest();
        generateRequest();
        generateRequest();
        const fromIndex = 0;
        const limit = 1;
        const filter = 'url3';
        const requestData = proxy.getRequestData(limit, fromIndex, filter);
        expect(requestData.requests.length).toEqual(1);
      });

      it('filters before limit and fromIndex are considered', function() {
        generateRequest();
        generateRequest();
        generateRequest();
        const fromIndex = 0;
        const limit = 1;
        const filter = 'url0';
        const requestData = proxy.getRequestData(limit, fromIndex, filter);
        expect(requestData.requests.length).toEqual(1);
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

      expect(request.fullUrl).toHaveBeenCalledWith('mappedUrl');
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

      expect(cycle.serve).toHaveBeenCalledWith({
        path: '/local/path'
      });
    });
  });

  describe('hoxy integration', function() {
    it('registers a callback to intercept requests', function() {
      expect(hoxyInstanceMock.intercept).toHaveBeenCalledWith('request');
    });
    it('registers a callback to intercept responses', function() {
      expect(hoxyInstanceMock.intercept).toHaveBeenCalledWith('response-sent');
    });
    it('registers a callback to intercept responses', function() {
      expect(hoxyInstanceMock.intercept).toHaveBeenCalledWith('response');
    });
  });

  describe('caching', function() {
    it('removes the header `if-modified-since`', function() {
      const response = generateRequest();
      expect(response.headers['if-modified-since']).toBe(undefined);
    });
    it('removes the header `if-none-match`', function() {
      const response = generateRequest();
      expect(response.headers['if-none-match']).toBe(undefined);
    });
    it('removes the header `etag`', function() {
      const response = generateRequest();
      expect(response.headers.etag).toBe(undefined);
    });
    it('removes the header `last-modified`', function() {
      const response = generateRequest();
      expect(response.headers['last-modified']).toBe(undefined);
    });
    it('changes the header `pragma` to `no-cache`', function() {
      const response = generateRequest();
      expect(response.headers.pragma).toBe('no-cache');
    });
    it('changes the header `cache-control` to `no-cache`', function() {
      const response = generateRequest();
      expect(response.headers['cache-control']).toBe('no-cache');
    });
    it('changes the header `expires` to `0`', function() {
      const response = generateRequest();
      expect(response.headers.expires).toBe('0');
    });
  });

  describe('clear', function() {
    it('removes all requests', function() {
      generateRequest();
      proxy.clear();
      expect(proxy.getRequestData().requests.length).toBe(0);
    });
    it('returns the correct totalCount after clearing', function() {
      generateRequest();
      proxy.clear();
      expect(proxy.getRequestData().totalCount).toBe(0);
    });
  });
});

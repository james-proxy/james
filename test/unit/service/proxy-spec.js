import Proxy from '../../../src/service/proxy.js';

describe('Proxy', function() {
  const update = () => {

  };

  const config = {
    maxLogEntries: 1000
  };
  const urlMapper = {
    get: sinon.stub(),
    isMappedUrl: sinon.stub()
  };

  let proxy;
  let hoxyInstanceMock;
  let callbacksRequest;
  let callbacksResponseSent;
  let generateRequest;

  beforeEach(function() {
    callbacksRequest = [];
    callbacksResponseSent = [];

    const intercept = function(name, callback) {
      if (name === 'request') {
        return callbacksRequest.push(callback);
      }
      if (name === 'response-sent') {
        return callbacksResponseSent.push(callback);
      }
    };
    hoxyInstanceMock = {
      intercept: sinon.spy(intercept),
      serve: sinon.spy()
    };

    urlMapper.isMappedUrl.returns(false);

    const createHoxy = () => {
      return hoxyInstanceMock;
    };

    let requestCount = 0;

    generateRequest = (callback) => {
      callback = callback || function() {
      };
      const id = 'url' + requestCount++;
      const request = {
        fullUrl: function() {
        }
      };

      sinon.stub(request, 'fullUrl').returns(id);

      const response = request;
      callbacksRequest.forEach((cb) => {
        cb(request, response, callback);
      });

      return request;
    };

    proxy = new Proxy(update, config, urlMapper, createHoxy);
  });

  describe('getRequestData', function() {
    it('has no requests on startup', function() {
      const requestData = proxy.getRequestData();

      expect(requestData).toEqual({
        requests: [],
        totalCount: 0
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
      urlMapper.get.returns({
        url: 'url0',
        newUrl: '/local/path',
        isLocal: true
      });

      generateRequest();

      expect(hoxyInstanceMock.serve).toHaveBeenCalledWith({
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

    describe('intercept request', function() {
      it('calls the callback', function() {
        const callback = sinon.spy();
        generateRequest(callback);

        expect(callback).toHaveBeenCalled();
      });
    });
  });
});

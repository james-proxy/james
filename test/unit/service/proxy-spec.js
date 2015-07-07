import Proxy from '../../../src/service/proxy.js';

describe('Proxy', function() {

  const update = () => {

  };

  const config = {};
  const urlMapper = {
    get: function(url, cb) {
      cb();
    }
  };

  let proxy, hoxyInstanceMock, callbacksRequest, callbacksResponseSent, generateRequest;
  beforeEach(function() {

    callbacksRequest = [];
    callbacksResponseSent = [];

    const intercept = function(name, callback) {
      if(name === 'request') {
        return callbacksRequest.push(callback);
      }
      if(name === 'response-sent') {
        return callbacksResponseSent.push(callback);
      }
    };
    hoxyInstanceMock = {
      intercept: sinon.spy(intercept)
    };

    const createHoxy = () => {
      return hoxyInstanceMock
    };

    let requestCount = 0;

    generateRequest = (callback) => {
      callback = callback || function() {};
      const request = {
        fullUrl: function() {
          return 'url' + requestCount;
        }
      };
      const response = request;
      callbacksRequest.forEach((cb) => {
        cb(request, response, callback);
      });
    };

    proxy = new Proxy(update, config, urlMapper, createHoxy);
  });

  describe('getRequestData', function() {
    it('has no requests on startup', function() {
      let requestData = proxy.getRequestData();

      expect(requestData).toEqual({
        requests: [],
        totalCount: 0
      })
    });

    describe('after intercepted requests', function() {
      beforeEach(function() {
        generateRequest();
      });

      it('returns a totalCount value of 1', function() {
        let requestData = proxy.getRequestData();
        expect(requestData.totalCount).toEqual(1);
      });

      it('returns a totalCount value of 20 after intercepting 20 requests', function() {

        for(let i = 0; i < 19; i++) {
          generateRequest();
        }

        let requestData = proxy.getRequestData();
        expect(requestData.totalCount).toEqual(20);
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

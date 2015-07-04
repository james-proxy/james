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

  let proxy, hoxyInstanceMock, callbacksRequest, callbacksResponseSent;
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
  });

  describe('hoxy integration', function() {
    it('registers a callback to intercept requests', function() {
      expect(hoxyInstanceMock.intercept).toHaveBeenCalledWith('request');
    });
    it('registers a callback to intercept responses', function() {
      expect(hoxyInstanceMock.intercept).toHaveBeenCalledWith('response-sent');
    });

    describe('intercept request', function() {
      it('calls done', function() {
        const done = sinon.spy();
        const req = {
          fullUrl: function() {}
        };
        const res = req;
        callbacksRequest[0](req, res, done);

        expect(done).toHaveBeenCalled();
      });
    });
  });

});

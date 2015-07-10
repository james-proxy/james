import uniqid from 'uniqid';

export default class Proxy {

  constructor(update, config, urlMapper, createHoxy, isCachingEnabled) {
    this._requests = [];
    this._urlMapper = urlMapper;
    this._config = config;
    this._update = update;
    this._isCachingEnabled = isCachingEnabled;

    const proxy = this._proxy = createHoxy();
    const that = this;

    proxy.intercept('response-sent', this._onResponseSent.bind(this));
    proxy.intercept('request', function(req, res, done) {
      that._onInterceptRequest(req, res, this, done);
    });
    proxy.intercept('response', function(req, res, done) {
      that._onInterceptResponse(req, res, this, done);
    });
  }

  _onResponseSent(req) {
    req.completed = new Date().getTime();
    req.took = req.completed - req.started;
    req.done = true;
    this._update();
  }

  _onInterceptResponse(request, response, cycle, done) {
    if (!this._isCachingEnabled()) {
      this._modifyCacheHeaders(response);
    }

    done();
  }

  _modifyCacheHeaders(response) {
    delete response.headers['if-modified-since'];
    delete response.headers['if-none-match'];
    delete response.headers['last-modified'];
    delete response.headers.etag;

    response.headers.expires = '0';
    response.headers.pragma = 'no-cache';
    response.headers['cache-control'] = 'no-cache';
  }

  _onInterceptRequest(request, response, cycle, done) {
    const fullUrl = request.fullUrl();

    request.done = false;
    request.id = uniqid();
    request.started = new Date().getTime();

    const requestContainer = {
      request: request,
      response: response
    };

    try {
      this._requests.unshift(requestContainer);
      if (this._requests.length > this._config.maxLogEntries) {
        this._requests.pop();
      }

      if (this._urlMapper.isMappedUrl(fullUrl)) {
        const mappedUrl = this._urlMapper.get(fullUrl);
        request.mapped = true;
        request.isLocal = mappedUrl.isLocal;
        request.newUrl = mappedUrl.newUrl;
        request.originalUrl = fullUrl;

        if (request.isLocal) {
          return cycle.serve({
            path: request.newUrl
          }, (err) => {
            done(err);
            this._update();
          });
        }

        request.fullUrl(request.newUrl);
      }

      done();
      this._update();
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  getRequestData(limit, fromIndex, filter) {
    fromIndex = fromIndex || 0;
    limit = limit || this._config.maxLogEntries;

    let requestCount = 0;
    const filteredRequests = this._requests
      .filter((request) => {
        if (!filter || request.request.fullUrl().indexOf(filter) !== -1) {
          request.requestNumber = requestCount++;
          return true;
        }
        return false;
      })
      .slice(fromIndex, fromIndex + limit);

    return {
      requests: filteredRequests,
      totalCount: this._requests.length,
      filteredCount: requestCount
    };
  }

}

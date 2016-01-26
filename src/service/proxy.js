import uniqid from 'uniqid';

export default class Proxy {

  constructor(update, config, urlMapper, createHoxy, isCachingEnabled) {
    this._requests = [];
    this._urlMapper = urlMapper;
    this._config = config;
    this._update = update;
    this._isCachingEnabled = isCachingEnabled;

    const proxy = this._proxy = createHoxy();

    proxy.intercept('response-sent', this._onResponseSent.bind(this));
    proxy.intercept('request', this._onInterceptRequest.bind(this));
    proxy.intercept('response', this._onInterceptResponse.bind(this));
  }

  _onResponseSent(req) {
    req.completed = new Date().getTime();
    req.took = req.completed - req.started;
    req.done = true;
    this._update();
  }

  _onInterceptResponse(request, response) {
    if (!this._isCachingEnabled()) {
      this._modifyCacheHeaders(response);
    }
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

  _onInterceptRequest(request, response, cycle) {
    const fullUrl = request.fullUrl();

    request.done = false;
    request.id = uniqid();
    request.started = new Date().getTime();
    request.originalUrl = fullUrl;

    const requestContainer = {
      request: request,
      response: response
    };

    try {
      this._requests.unshift(requestContainer);
      if (this._requests.length > this._config.maxLogEntries) {
        this._requests.pop();
      }

      request.isMappingActive = this._urlMapper.isActiveMappedUrl(fullUrl);
      request.isMappedUrl = this._urlMapper.isMappedUrl(fullUrl);

      if (request.isMappingActive) {
        const mappedUrl = this._urlMapper.get(fullUrl);
        request.isLocal = mappedUrl.isLocal;
        request.newUrl = mappedUrl.newUrl;

        if (request.isLocal) {
          return cycle.serve({
            path: request.newUrl
          }, () => {
            this._update();
          });
        }

        request.fullUrl(request.newUrl);
      }

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

  clear() {
    this._requests = [];
  }

  /**
   * Adjusts the proxy to throttle the overall connection speed to the provided kilobytes/second.
   * @param rate maximum overall speed in kilobytes/second
   */
  slow(rate) {
    rate *= 1024;
    this._proxy.slow({rate});
  }

  /**
   * Disables throttling, allowing the proxy to run at maximum speed
   */
  disableThrottling() {
    this._proxy.slow({});
  }
}



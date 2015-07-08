import uniqid from 'uniqid';

export default class Proxy {

  constructor(update, config, urlMapper, createHoxy) {
    this._requests = [];
    this._urlMapper = urlMapper;
    this._config = config;
    this._update = update;

    const proxy = this._proxy = createHoxy();

    proxy.intercept('response-sent', this._onResponseSent.bind(this));
    proxy.intercept('request', this._onInterceptRequest.bind(this));
  }

  _onResponseSent(req) {
    req.completed = new Date().getTime();
    req.took = req.completed - req.started;
    req.done = true;
    this._update();
  }

  _onInterceptRequest(request, response, done) {
    const fullUrl = request.fullUrl();

    request.done = false;
    request.id = uniqid();
    request.started = new Date().getTime();

    const requestContainer = {
      request: request,
      response: response
    };

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
        return this._proxy.serve({
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
      totalCount: this._requests.length
    };
  }

}

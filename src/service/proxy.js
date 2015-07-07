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

  _onInterceptRequest(req, res, done) {
    const that = this;
    try {
      that._map(req, () => {
        req.done = false;
        req.id = uniqid();
        req.started = new Date().getTime();

        const request = {
          request: req,
          response: res
        };

        that._requests.unshift(request);
        if (that._requests.length > that._config.maxLogEntries) {
          that._requests.pop();
        }

        if (req.mapped) {
          if (req.isLocal) {
            return this.serve({
              path: req.newUrl
            }, function(err) {
              done(err);
              that._update();
            });
          }

          req.fullUrl(req.newUrl);
        }

        done();
        that._update();
      });

    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  _map(request, callback) {
    const fullUrl = request.fullUrl();
    this._urlMapper.get(fullUrl, (err, mappedUrl) => {
      if (mappedUrl) {
        request.mapped = true;
        request.isLocal = mappedUrl.isLocal;
        request.newUrl = mappedUrl.newUrl;
        request.originalUrl = fullUrl;
      }
      callback();
    });
  }

  getRequestData(limit, fromIndex, filter) {
    limit = limit || this._config.maxLogEntries;

    let requestCount = 0;
    let requests = this._requests;

    requests = requests.filter((request) => {
      if (!filter || request.request.fullUrl().indexOf(filter) !== -1) {
        request.requestNumber = requestCount++;
        return true;
      }
      return false;
    });

    return {
      requests: requests.slice(fromIndex, fromIndex + limit),
      totalCount: this._requests.length
    };
  }

}

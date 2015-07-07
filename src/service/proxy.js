import hoxy from 'hoxy';
import uniqid from 'uniqid';

export default class Proxy {

  constructor(update, config, urlMapper) {
    this._requests = [];
    this._urlMapper = urlMapper;
    this._config = config;

    const proxy = this._proxy = new hoxy.Proxy().listen(1338);
    const that = this;

    proxy.intercept('response-sent', function(req) {
      req.completed = new Date().getTime();
      req.took = req.completed - req.started;
      req.done = true;
      update();
    });
    proxy.intercept('request', function(req, res, done) {
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
          if (that._requests.length > config.maxLogEntries) {
            that._requests.pop();
          }

          if (req.mapped) {
            if (req.isLocal) {
              return this.serve({
                path: req.newUrl
              }, function(err) {
                done(err);
                update();
              });
            }

            req.fullUrl(req.newUrl);
          }

          done();
          setTimeout(function() {
            update();
          }, 0);
        });
      } catch (e) {
        console.log(e); // eslint-disable-line
      }
    });
  }

  _splitFullurl(fullUrl) {
    const splitUrl = fullUrl.split('://');
    const protocol = splitUrl.shift() + ':';

    const hostAndUrl = splitUrl.join('://');
    const splitHostAndUrl = hostAndUrl.split('/');
    const hostname = splitHostAndUrl.shift();
    const url = '/' + splitHostAndUrl.join('/');

    return {
      protocol,
      hostname,
      url
    };
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
      totalCount: this._requests.length,
      filter: filter
    };
  }

}

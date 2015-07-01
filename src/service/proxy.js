import hoxy from 'hoxy';
import uniqid from 'uniqid';

export default class Proxy {

  constructor(update, config, urlMapper) {

    this._requests = [];
    this._urlMapper = urlMapper;

    const proxy = this._proxy = new hoxy.Proxy().listen(1338);
    const that = this;

    proxy.intercept('response-sent', function(req, res) {
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
                update();
                done(err);
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
        console.log(e);
      }

    });

  }

  _splitFullurl(fullUrl) {
    let splitUrl = fullUrl.split('://');
    let protocol = splitUrl.shift() + ':';

    let hostAndUrl = splitUrl.join('://');
    let splitHostAndUrl = hostAndUrl.split('/');
    let hostname = splitHostAndUrl.shift();
    let url = '/' + splitHostAndUrl.join('/');

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

        console.log(mappedUrl);

        request.mapped = true;
        request.isLocal = mappedUrl.isLocal;
        request.newUrl = mappedUrl.newUrl;
        request.originalUrl = fullUrl;
      }
      callback();
    });
  }

  getRequests() {
    return this._requests;
  }

}

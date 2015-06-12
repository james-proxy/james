import hoxy from 'hoxy';

export default class Proxy {

  constructor(update, config, urlMapper) {

    this._requests = [];
    this._urlMapper = urlMapper;

    const proxy = this._proxy = new hoxy.Proxy().listen(1338);

    proxy.intercept('request', (req, res, done) => {

      try {

        this._map(req, () => {

          const request = {
            request: req,
            response: res
          };

          this._requests.unshift(request);
          if(this._requests.length > config.maxLogEntries) {
            this._requests.pop();
          }
          update();
          done();

        });

      } catch(e) {
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
      if(mappedUrl) {

        request.fullUrl(mappedUrl.newUrl);

        request.mapped = true;
        request.originalUrl = fullUrl;
      }
      callback();
    });
  }

  getRequests() {
    return this._requests;
  }

}

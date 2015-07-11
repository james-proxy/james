import React from 'react';

const {object, bool} = React.PropTypes;

export default class FullUrl extends React.Component {

  _shorten(str, maxLength) {
    if (str.length > maxLength) {
      return str.substr(0, maxLength) + '…';
    }
    return str;
  }

  render() {
    const {request, isShortened} = this.props;

    let maxUrlLength = 1000;
    if (isShortened) {
      maxUrlLength = 60;
    }

    let port = null;
    if (request.port) {
      port = <span className="port">:{request.port}</span>;
    }

    return <div className="complete-url">
      <span className="protocol">{request.protocol}//</span>
      <span className="hostname">{request.hostname}</span>
      {port}
      <span className="url">{this._shorten(request.url, maxUrlLength)}</span>
      <span className="fade-out"></span>
    </div>;
  }
}

FullUrl.propTypes = {
  isShortened: bool,
  request: object.isRequired
};

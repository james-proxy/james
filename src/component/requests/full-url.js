import React from 'react';

const {object, bool} = React.PropTypes;

const _shorten = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.substr(0, maxLength) + '…';
  }
  return str;
};

const FullUrl = (props) => {
  const {request, isShortened} = props;
  const original = request.original;

  let maxUrlLength = 1000;
  if (isShortened) {
    maxUrlLength = 60;
  }

  let port = null;
  if (request.port) {
    port = <span className="port">:{original.port}</span>;
  }

  return <div className="complete-url">
    <span className="protocol">{original.protocol + '//'}</span>
    <span className="hostname">{original.hostname}</span>
    {port}
    <span className="url">{_shorten(original.url, maxUrlLength)}</span>
  </div>;
};

FullUrl.propTypes = {
  isShortened: bool,
  request: object.isRequired
};

export default FullUrl;

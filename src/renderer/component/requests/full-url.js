import React from 'react';
import PropTypes from 'prop-types';

const _shorten = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.substr(0, maxLength) + '…';
  }
  return str;
};

const FullUrl = (props) => {
  const {request, isShortened, title} = props;
  const original = request.original;

  let maxUrlLength = 1000;
  if (isShortened) {
    maxUrlLength = 60;
  }

  let port = null;
  if (request.port) {
    port = <span className="port">:{original.port}</span>;
  }

  const urlContainer = <div className="complete-url">
    <span className="protocol">{original.protocol + '//'}</span>
    <span className="hostname">{original.hostname}</span>
    {port}
    <span className="url">{_shorten(original.url, maxUrlLength)}</span>
  </div>;

  if (title) {
    return <section>
      <h3>{title}</h3>
      {urlContainer}
    </section>;
  }

  return urlContainer;
};

FullUrl.propTypes = {
  isShortened: PropTypes.bool,
  request: PropTypes.object.isRequired,
  title: PropTypes.string
};

export default FullUrl;

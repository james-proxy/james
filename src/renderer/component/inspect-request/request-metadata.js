import React from 'react';
import PropTypes from 'prop-types';

const RequestMetadata = (props) => {
  const { metadata, title } = props;
  const keys = Object.keys(metadata);

  if (keys.length === 0) {
    return null;
  }

  const metaNodes = keys.map((key) => {
    return <li key={key}>
      <strong>{key}:&nbsp;</strong>
      {String(metadata[key])}
    </li>;
  });

  return <section>
    <h3>{title}</h3>
    <ul className="request-metadata">{metaNodes}</ul>
  </section>;
};

RequestMetadata.propTypes = {
  metadata: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default RequestMetadata;

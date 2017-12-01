import React from 'react';
import PropTypes from 'prop-types';


const RequestMetadata = (props) => {
  const {metadata} = props;
  const metaNodes = Object.keys(metadata).map((key) => {
    return <li key={key}>
      <strong>{key}:&nbsp;</strong>
      {metadata[key]}
    </li>;
  });

  return <ul className="request-metadata">{metaNodes}</ul>;
};

RequestMetadata.propTypes = {
  metadata: PropTypes.object.isRequired
};

export default RequestMetadata;

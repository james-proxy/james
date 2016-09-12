import React from 'react';

const {object} = React.PropTypes;

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
  metadata: object.isRequired
};

export default RequestMetadata;

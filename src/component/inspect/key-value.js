import React from 'react';

const {string} = React.PropTypes;

export const KeyValue = ({_key, value}) => {
  return <div className="key-value">
    <strong>{_key}:</strong> {value}
  </div>;
};

KeyValue.propTypes = {
  headerKey: string.isRequired,
  value: string.isRequired
};
import React from 'react';

const {string} = React.PropTypes;

const KeyValue = ({_key, value}) => {
  return <div className="key-value">
    <strong>{_key}:</strong> {value}
  </div>;
};

KeyValue.propTypes = {
  _key: string.isRequired,
  value: string.isRequired
};

export default KeyValue;

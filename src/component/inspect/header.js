import React from 'react';

const {string} = React.PropTypes;

export const Header = ({headerKey, value}) => {
  return <div className="request-header">
    <strong>{headerKey}:</strong> {value}
  </div>;
};

Header.propTypes = {
  headerKey: string.isRequired,
  value: string.isRequired
};
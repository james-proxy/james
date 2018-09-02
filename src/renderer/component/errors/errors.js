import React from 'react';
import PropTypes from 'prop-types';

const Errors = props => {
  if (!props.errors.length) return null;

  return <div className="errors">
    <ul className="errors-list">
      {props.errors.map(error => <li className="errors-list__item">{error}</li>)}
    </ul>
  </div>;
};

Errors.propTypes = {
  errors: PropTypes.array
};

export default Errors;

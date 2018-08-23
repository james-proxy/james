import React from 'react';
import PropTypes from 'prop-types';

const Errors = props =>
  <div className="errors">
    <ul className="errors-list">
      <li className="errors-list__item">
        {props.errors.map(error => <p>{error}</p>)}
      </li>
    </ul>
  </div>
;

Errors.propTypes = {
  errors: PropTypes.array
};

export default Errors;

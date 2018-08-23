import React from 'react';
import PropTypes from 'prop-types';

import Errors from '../errors/errors.js';

const NewMappingTarget = (props) => {
  const {target, update, createUrl, createFile, errors = []} = props;

  const onChange = (event) => { update(event.target.value); };

  return <div className="mapping-target">
    <h1>Create new URL Mapping</h1>
    { errors.length ? <Errors errors={ errors }/> : '' }
    <div className="description">URL mappings allow James to intercept a request and respond with a URL or file of your choice.</div>
    <input type="text"
      autoFocus
      placeholder="Enter target URL to map"
      value={target}
      onChange={onChange} />
    <button className="btn waves-effect waves-light" onClick={createUrl}>URL to URL</button>
    <button className="btn waves-effect waves-light" onClick={createFile}>URL to File</button>
  </div>;
};

NewMappingTarget.propTypes = {
  target: PropTypes.string,
  update: PropTypes.func.isRequired,
  createUrl: PropTypes.func.isRequired,
  createFile: PropTypes.func.isRequired,
  errors: PropTypes.array
};

NewMappingTarget.defaultProps = {
  target: ''
};

export default NewMappingTarget;

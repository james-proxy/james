import React from 'react';
import PropTypes from 'prop-types';
import {remote} from 'electron';

import Errors from '../errors/errors.js';

import createChooseFile from 'common/service/choose-file.js';

const NewMappingDestination = (props) => {
  const {isLocal, destination, update, create, cancel, errors = []} = props;

  const chooseFile = createChooseFile(remote.getCurrentWindow());

  const selectFile = () => {
    chooseFile((paths) => {
      if (!paths) return;
      const path = paths[0];

      update(path);
    });
  };

  const onChange = (event) => { update(event.target.value); };

  let input;
  if (isLocal) {
    input = <button autoFocus className="input-file btn waves-effect waves-light" onClick={selectFile}>Choose file</button>;
  } else {
    input = <input autoFocus type="text" value={destination} onChange={onChange} placeholder="http(s)://" />;
  }

  const type = isLocal ? 'file' : 'URL';

  return <div className="mapping-destination">
    <h1>Enter destination</h1>
    { errors.length ? <Errors errors={ errors }/> : '' }
    <div className="description">James will respond with this {type} instead.</div>
    <div>
      {input}
    </div>
    <button className="btn waves-effect waves-light" onClick={create}>Create</button>
    <button className="btn-flat waves-effect waves-light" onClick={cancel}>Cancel</button>
  </div>;
};

NewMappingDestination.propTypes = {
  isLocal: PropTypes.bool,
  destination: PropTypes.string,
  update: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  errors: PropTypes.array
};

NewMappingDestination.defaultProps = {
  isLocal: false,
  destination: ''
};

export default NewMappingDestination;

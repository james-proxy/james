import React from 'react';
import {remote} from 'electron';
import createChooseFile from '../../service/choose-file.js';

const {bool, string, func} = React.PropTypes;

const NewMappingDestination = (props) => {
  const {isLocal, destination, update, create, cancel} = props;

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
    input = {
      className: 'input-file',
      disabled: 'disabled',
      placeholder: 'Choose file',
      onClick: selectFile
    };
  } else {
    input = {
      placeholder: 'http(s)://'
    };
  }

  const type = isLocal ? 'file' : 'URL';

  return <div className="mapping-destination">
    <h1>Enter destination</h1>
    <div className="description">James will respond with this {type} instead.</div>
    <input type="text" autoFocus value={destination} onChange={onChange} {...input} />
    <button className="btn waves-effect waves-light" onClick={create}>Create</button>
    <button className="btn-flat waves-effect waves-light" onClick={cancel}>Cancel</button>
  </div>;
};

NewMappingDestination.propTypes = {
  isLocal: bool,
  destination: string,
  update: func.isRequired,
  create: func.isRequired,
  cancel: func.isRequired
};

NewMappingDestination.defaultProps = {
  isLocal: false,
  destination: ''
};

export default NewMappingDestination;

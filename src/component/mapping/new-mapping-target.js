import React from 'react';

const {string, func} = React.PropTypes;

const NewMappingTarget = (props) => {
  const {target, update, createUrl, createFile} = props;

  const onChange = (event) => { update(event.target.value); };

  return <div className="mapping-target">
    <h1>Create new URL Mapping</h1>
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
  target: string,
  update: func.isRequired,
  createUrl: func.isRequired,
  createFile: func.isRequired
};

NewMappingTarget.defaultProps = {
  target: ''
};

export default NewMappingTarget;

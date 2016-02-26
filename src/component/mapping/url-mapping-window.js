import React from 'react';
import NewMapping from './new-mapping.js';
import UrlMapping from './url-mapping.js';

const {func, array, string} = React.PropTypes;

const UrlMappingWindow = (props) => {
  const {
    urlInput,
    setUrlMapping,
    removeUrlMapping,
    toggleUrlMappingIsActive,
    closeWindow
  } = props;

  let {urlMappings} = props;
  urlMappings = urlMappings.map((mapping, index) => {
    return <UrlMapping key={index}
              mapping={mapping}
              toggleActive={toggleUrlMappingIsActive}
              remove={removeUrlMapping}
            />;
  });

  return <div className="window url-mapping-window">
    <div className="url-mapping-header">
      <button className="window-close-button btn waves-effect waves-light" onClick={closeWindow}>
        <i className="fa fa-remove" />
        close
      </button>
      <h4>URL Mappings</h4>
      <NewMapping target={urlInput} saveMapping={setUrlMapping} />
    </div>
    <div className="url-mapping-footer">
      <ul className="collection with-header">
        {urlMappings}
      </ul>
    </div>
  </div>;
};

UrlMappingWindow.defaultProps = {
  urlInput: ''
};

UrlMappingWindow.propTypes = {
  urlInput: string,
  urlMappings: array.isRequired,
  setUrlMapping: func.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingIsActive: func.isRequired,
  closeWindow: func.isRequired
};

export default UrlMappingWindow;

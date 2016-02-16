import React from 'react';
import NewMapping from '../mapping/new-mapping.js';
import Mapping from '../mapping/mapping.js';

const {func, array, string} = React.PropTypes;

export default class UrlMappingWindow extends React.Component {

  render() {
    const {
      urlInput,
      setUrlMapping,
      removeUrlMapping,
      toggleUrlMappingIsActive,
      closeWindow
    } = this.props;

    let {urlMappings} = this.props;
    urlMappings = urlMappings.map((mapping, index) => {
      return <Mapping key={index}
                mapping={mapping}
                toggleActive={toggleUrlMappingIsActive}
                remove={removeUrlMapping}
              />;
    });

    return <div className="window url-mapping-window">
      <a href="#!" onClick={closeWindow} className="close-button">
        <i className="fa fa-remove"></i>
      </a>
      <h4>URL Mappings</h4>
      <NewMapping saveMapping={setUrlMapping} target={urlInput} />
      <ul className="collection with-header">
        {urlMappings}
      </ul>
    </div>;
  }
}

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

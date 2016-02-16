import React from 'react';
import NewMapping from '../mapping/new-mapping.js';

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
    urlMappings = urlMappings.map((map, index) => {
      const removeMapping = () => {
        removeUrlMapping(map.url);
      };

      const toggleIsActive = () => {
        toggleUrlMappingIsActive(map.url);
      };

      const isActiveClass = map.isActive ? 'on' : 'off';

      return <li className="collection-item" key={index}>
        <div>
          <span className="col protocol">
            http(s)://
          </span>
          <span className="col text-ellipsis mask">
            {map.url}
          </span>
          <span className="seperator">
            <i className="fa fa-chevron-right"></i>
          </span>
          <span className="col text-ellipsis new-url">
            {map.newUrl}
          </span>
          <a href="#!" className="secondary-content" onClick={toggleIsActive}>
            <i className={'fa fa-toggle-' + isActiveClass}></i>
          </a>
          <a href="#!" className="secondary-content" onClick={removeMapping}>
            <i className="fa fa-remove"></i>
          </a>
        </div>
      </li>;
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

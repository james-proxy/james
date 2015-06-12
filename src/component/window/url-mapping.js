import React from 'react';

const {func, object} = React.PropTypes;

export default class UrlMappingWindow extends React.Component {

  constructor() {
    super();

    this.state = {
      urlInput: '',
      newUrlInput: ''
    };
  }

  setUrlValue() {
    this.setState({urlInput: event.target.value});
  }

  setNewUrlValue() {
    this.setState({newUrlInput: event.target.value});
  }

  saveMapping() {
    const {urlMapper} = this.props;
    const {urlInput, newUrlInput} = this.state;

    this.setState({
      urlInput: '',
      newUrlInput: ''
    });

    urlMapper.set(urlInput, newUrlInput)
  }

  render() {

    const {urlInput, newUrlInput} = this.state;
    let {urlMapper, mappings, closeWindow} = this.props;

    mappings = mappings.map((map, index) => {

      const removeMapping = () => {
        urlMapper.removeByNewUrl(map.newUrl);
      };

      return <li className="collection-item" key={index}>
        <div>
          <span className="col">
            {map.url}
          </span>
          <span className="seperator">
            <i className="fa fa-chevron-right"></i>
          </span>
          <span className="col">
            {map.newUrl}
          </span>
          <a href="#!" className="secondary-content" onClick={removeMapping}>
            <i className="fa fa-remove"></i>
          </a>
        </div>
      </li>
    });

    return <div className="window url-mapping-window">
      <a href="#!" onClick={closeWindow}>
        <i className="fa fa-remove"></i>
      </a>
      <ul className="collection with-header">
        <li className="collection-header">
          <h4>Map Settings</h4>
        </li>
        <li className="collection-item add-mapping">
          <div>
            <input
              value={urlInput}
              className="col"
              type="text"
              placeholder="Enter the URL to map"
              onChange={this.setUrlValue.bind(this)}
            />
            <span className="seperator">
              <i className="fa fa-chevron-right"></i>
            </span>
            <input
              value={newUrlInput}
              className="col"
              type="text"
              placeholder="Enter the new URL"
              onChange={this.setNewUrlValue.bind(this)}
            />
            <a href="#!" className="secondary-content" onClick={this.saveMapping.bind(this)}>
              <i className="fa fa-plus"></i>
            </a>
          </div>
        </li>
        {mappings}
      </ul>
    </div>
  }
}

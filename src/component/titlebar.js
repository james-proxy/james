import React from 'react';

const {func, object} = React.PropTypes;

export default class TitleBar extends React.Component {

  urlMappingsClickHandler() {
    const {showWindow} = this.props;
    showWindow('UrlMapping');
  }

  render() {

    const {mapCount} = this.props;

    let MapCountLabel;

    if(mapCount > 0) {
      MapCountLabel = <span className="label default">
        {mapCount}
      </span>;
    }

    return <div className="titlebar">
      <span className="logo">
        J
      </span>
      <a onClick={this.urlMappingsClickHandler.bind(this)}>
        <i className=" fa fa-plug"></i>
        URL Mappings
        {MapCountLabel}
      </a>
    </div>
  }
}

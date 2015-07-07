import React from 'react';

const {func, number} = React.PropTypes;

export default class TitleBar extends React.Component {

  urlMappingsClickHandler() {
    const {showWindow} = this.props;
    showWindow('UrlMapping');
  }

  openDevTools() {
    const {openDevTools} = this.props;
    openDevTools();
  }

  render() {
    const {urlMapCount} = this.props;

    let UrlMapCountLabel;

    if (urlMapCount > 0) {
      UrlMapCountLabel = <span className="label default">
        {urlMapCount}
      </span>;
    }

    return <div className="titlebar">
      <span className="logo">
        J
      </span>
      <a onClick={this.urlMappingsClickHandler.bind(this)}>
        <i className=" fa fa-plug"></i>
        URL Mappings
        {UrlMapCountLabel}
      </a>
      <a className="right" onClick={this.openDevTools.bind(this)}>
        <i className=" fa fa-cog"></i>
        Developer
      </a>
    </div>;
  }
}

TitleBar.propTypes = {
  showWindow: func.isRequired,
  openDevTools: func.isRequired,
  urlMapCount: number.isRequired
};

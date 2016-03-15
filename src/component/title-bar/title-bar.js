import React from 'react';

const {func, number} = React.PropTypes;

const TitleBar = (props) => {
  const {
    toggleWindow,
    openDevTools,
    urlMapCount
  } = props;

  const openUrlMapping = () => {
    toggleWindow('UrlMapping');
  };

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
    <a onClick={openUrlMapping}>
      <i className=" fa fa-plug" />
      URL Mappings
      {UrlMapCountLabel}
    </a>
    <a className="right" onClick={openDevTools}>
      <i className=" fa fa-cog" />
      Developer
    </a>
  </div>;
};

TitleBar.propTypes = {
  toggleWindow: func.isRequired,
  openDevTools: func.isRequired,
  urlMapCount: number.isRequired
};

export default TitleBar;

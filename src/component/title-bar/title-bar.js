import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { toggleDevTools } from '../../actions/app.js';

const {func, number} = React.PropTypes;

const TitleBar = ({urlMapCount, openDevTools}) => {
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
    <Link to="/">
      Home
    </Link>
    <Link to="/requests">
      <i className="fa fa-exchange" />
      Requests
    </Link>
    <Link to="/url-mappings">
      <i className="fa fa-plug" />
      Mappings
      {UrlMapCountLabel}
    </Link>
    <a className="right" onClick={openDevTools}>
      <i className=" fa fa-cog" />
      Developer
    </a>
  </div>;
};

TitleBar.propTypes = {
  openDevTools: func.isRequired,
  urlMapCount: number.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  openDevTools: () => { dispatch(toggleDevTools()); }
});

export default connect(null, mapDispatchToProps)(TitleBar);

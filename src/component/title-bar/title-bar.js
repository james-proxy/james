import React from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';

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
    <IndexLink to="/" activeClassName="active">
      Home
    </IndexLink>
    <Link to="/requests" activeClassName="active">
      <i className="fa fa-exchange" />
      Requests
    </Link>
    <Link to="/url-mappings" activeClassName="active">
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

const mapStateToProps = (state) => ({
  active: state.routing, // trigger connect to update component on routing change
  urlMapCount: state.urlMappings.count
});

const mapDispatchToProps = {
  openDevTools: toggleDevTools
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleBar);

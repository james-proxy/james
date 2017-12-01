import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

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
    <NavLink to="/" exact activeClassName="active">
      Home
    </NavLink>
    <NavLink to="/requests" exact activeClassName="active">
      <i className="fa fa-exchange" />
      Requests
    </NavLink>
    <NavLink to="/url-mappings" exact activeClassName="active">
      <i className="fa fa-plug" />
      Mappings
      {UrlMapCountLabel}
    </NavLink>
    <a className="right" onClick={openDevTools}>
      <i className=" fa fa-cog" />
      Developer
    </a>
  </div>;
};

TitleBar.propTypes = {
  openDevTools: PropTypes.func.isRequired,
  urlMapCount: PropTypes.number.isRequired
};

import { toggleDevTools } from 'common/actions/app.js';
import { getMappingCount } from '../../reducers/url-mappings.js';

const mapStateToProps = (state) => ({
  active: state.routing, // trigger connect to update component on routing change
  urlMapCount: getMappingCount(state)
});

const mapDispatchToProps = {
  openDevTools: toggleDevTools
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleBar);

import React from 'react';
import { NavLink } from 'react-router-dom';

import { toggleDevTools } from '../../../common/service/dev-tools.js';

import MappingCount from './mapping-count.js';

export default () =>
  <div className="titlebar">
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
      <MappingCount />
    </NavLink>
    <a className="right" onClick={toggleDevTools}>
      <i className=" fa fa-cog" />
      Developer
    </a>
  </div>;

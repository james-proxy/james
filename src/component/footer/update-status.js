import { remote, shell } from 'electron';
const { app } = remote;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import constants from '../../constants.js';

const openChangelog = (e) => {
  e.preventDefault();
  shell.openExternal('https://github.com/james-proxy/james/blob/master/CHANGELOG.md');
};

const restart = (e) => {
  e.preventDefault();
  app.relaunch();
  app.quit();
};

const statusMap = {
  [constants.UPDATE_OK]: {},
  [constants.UPDATE_AVAILABLE]: {
    message: 'An update is available!',
    title: 'Show changelog',
    onClick: openChangelog
  },
  [constants.UPDATE_DOWNLOADING]: {
    message: 'Downloading update...',
    title: 'Show changelog',
    onClick: openChangelog
  },
  [constants.UPDATE_READY]: {
    message: 'Restart to update!',
    title: 'Restart and install James',
    onClick: restart
  },
  [constants.UPDATE_ERROR]: {
    message: 'Unable to update'
  }
};

const UpdateStatus = ({status, info}) => {
  const icon = 'fa fa-cloud-upload';
  const classes = `update-status ${status}`;
  const { message, onClick } = statusMap[status];
  let { title } = statusMap[status];

  if (status === constants.UPDATE_READY && info) {
    title = `Restart and install James ${info.releaseName}`;
  } else if ( status === constants.UPDATE_ERROR && info) {
    title = info;
  }

  return <div className={classes} title={title} onClick={onClick}>
    <i className={icon} />
    <span className="message">{message}</span>
  </div>;
};

UpdateStatus.propTypes = {
  status: PropTypes.oneOf([
    constants.UPDATE_OK,
    constants.UPDATE_AVAILABLE,
    constants.UPDATE_DOWNLOADING,
    constants.UPDATE_READY,
    constants.UPDATE_ERROR
  ]),
  info: PropTypes.object
};


import { getUpdateStatus } from '../../reducers/app.js';

const mapStateToProps = (state) => {
  return getUpdateStatus(state);
};

export default connect(mapStateToProps)(UpdateStatus);

import { remote, shell } from 'electron';
const { app } = remote;

import React from 'react';
import PropTypes from 'prop-types';

import constants from 'common/constants.js';

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
  [constants.UPDATE_OK]: () => ({}),
  [constants.UPDATE_CHECKING]: () => ({
    title: 'Checking for updates...'
  }),
  [constants.UPDATE_AVAILABLE]: () => ({
    message: 'An update is available!',
    title: 'Show changelog',
    onClick: openChangelog
  }),
  [constants.UPDATE_DOWNLOADING]: progress => ({
    message: `Downloading update... ${progress.percent}%`,
    title: 'Show changelog',
    onClick: openChangelog
  }),
  [constants.UPDATE_READY]: info => ({
    message: 'Restart to update!',
    title: `Restart and install James ${info.version}`,
    onClick: restart
  }),
  [constants.UPDATE_ERROR]: err => ({
    message: 'Unable to update',
    title: err
  })
};

const UpdateStatus = ({status}) => {
  const icon = 'fa fa-cloud-upload';
  const classes = `update-status ${status}`;
  const { message, title, onClick } = statusMap[status];

  return <div className={classes} title={title} onClick={onClick}>
    <i className={icon} />
    <span className="message">{message}</span>
  </div>;
};

UpdateStatus.propTypes = {
  status: PropTypes.oneOf([
    constants.UPDATE_OK,
    constants.UPDATE_CHECKING,
    constants.UPDATE_AVAILABLE,
    constants.UPDATE_DOWNLOADING,
    constants.UPDATE_READY,
    constants.UPDATE_ERROR
  ]),
  info: PropTypes.object
};

export default UpdateStatus;

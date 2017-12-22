import { remote, shell } from 'electron';
const { app } = remote;

import React from 'react';
import PropTypes from 'prop-types';

import constants from 'common/constants.js';
import { UpdateStatus as UpdateStatusTypes } from 'common/prop-types';

const launchURL = (e, url) => {
  e.preventDefault();
  shell.openExternal(url);
};

const openChangelog = e => launchURL(e, 'https://github.com/james-proxy/james/blob/master/CHANGELOG.md');
const openIssues = e => launchURL(e, 'https://github.com/james-proxy/james/issues');

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
  [constants.UPDATE_AVAILABLE]: info => ({
    message: `James ${info.version} is available!`,
    title: 'Show changelog',
    onClick: openChangelog
  }),
  [constants.UPDATE_DOWNLOADING]: progress => ({
    message: `Downloading update (${progress.percent.toFixed(0)}%)`,
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
    title: err,
    onClick: openIssues
  })
};

const UpdateStatus = ({status, info}) => {
  const icon = 'fa fa-cloud-upload';
  const classes = `update-status ${status}`;
  const { message, title, onClick } = statusMap[status](info);

  return <div className={classes} title={title} onClick={onClick}>
    <i className={icon} />
    <span className="message">{message}</span>
  </div>;
};

UpdateStatus.propTypes = {
  status: UpdateStatusTypes,
  info: PropTypes.any
};

export default UpdateStatus;

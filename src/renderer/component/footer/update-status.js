import { remote, shell } from 'electron';

import React from 'react';
import PropTypes from 'prop-types';

import constants from '../../../common/constants.js';
import config from '../../../common/config.js';
import { UpdateStatus as UpdateStatusTypes } from '../../../common/prop-types';

const launchURL = (e, url) => {
  e.preventDefault();
  shell.openExternal(url);
};

const openChangelog = e => launchURL(e, 'https://github.com/james-proxy/james/blob/master/CHANGELOG.md');
const openIssues = e => launchURL(e, 'https://github.com/james-proxy/james/issues');

const statusMap = {
  [constants.UPDATE_OK]: (info, app) => ({
    message: `v${config.version(app)}`,
    icon: '',
    title: 'James is up to date',
    onClick: openChangelog
  }),
  [constants.UPDATE_CHECKING]: () => ({
    title: 'Checking for updates...',
    icon: 'fa-cloud'
  }),
  [constants.UPDATE_AVAILABLE]: info => ({
    message: `James ${info.version} is available!`,
    icon: 'fa-cloud-upload',
    title: 'Show changelog',
    onClick: openChangelog
  }),
  [constants.UPDATE_DOWNLOADING]: progress => ({
    message: `Downloading update (${progress.percent.toFixed(0)}%)`,
    icon: 'fa-cloud-download',
    title: 'Show changelog',
    onClick: openChangelog
  }),
  [constants.UPDATE_READY]: info => ({
    message: 'Restart to update!',
    icon: 'fa-cloud-upload',
    title: `James ${info.version} is ready to launch`
  }),
  [constants.UPDATE_ERROR]: err => ({
    message: 'Unable to update',
    icon: 'fa-exclamation-circle',
    title: err,
    onClick: openIssues
  })
};

const UpdateStatus = ({status, info}) => {
  const { message, icon, title, onClick } = statusMap[status](info, remote.app);
  const classes = `update-status ${status} ${onClick ? 'has-action' : ''}`;

  return <div className={classes} title={title} onClick={onClick}>
    <i className={`fa ${icon}`} />
    <span className="message">{message}</span>
  </div>;
};

UpdateStatus.propTypes = {
  status: UpdateStatusTypes,
  info: PropTypes.any
};

export default UpdateStatus;

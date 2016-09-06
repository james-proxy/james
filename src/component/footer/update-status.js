import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import constants from '../../constants.js';

const messageMap = {
  [constants.UPDATE_OK]: '',
  [constants.UPDATE_AVAILABLE]: 'Update is available',
  [constants.UPDATE_DOWNLOADING]: 'Downloading update...',
  [constants.UPDATE_READY]: 'Restart to update!',
  [constants.UPDATE_ERROR]: 'Unable to update'
};

const UpdateStatus = ({status, info}) => {
  const icon = 'fa fa-cloud-upload';
  const message = messageMap[status];
  const classes = ['update-status', status];

  let title = '';
  if (status === constants.UPDATE_READY && info) {
    title = `Ready to install James ${info.releaseName}`;
  }
  
  return <div className={classes.join(' ')} title={title}>
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

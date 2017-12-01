import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Request from './request.js';

const Requests = ({requestData, activeRequest, contextRequest, labels, handleClick, handleContextMenu}) => {
  const requestNodes = requestData.requests.map(({request, response}) => {
    const isActive = activeRequest && activeRequest.id === request.id || false;
    const isContextMenu = contextRequest && contextRequest.id === request.id || false;

    return <Request
      request={request}
      response={response}
      done={request.done}
      isActive={isActive}
      isContextMenu={isContextMenu}
      labels={labels}
      key={request.id}
      handleClick={handleClick}
      handleContextMenu={handleContextMenu}
    />;
  });

  return <div className="requests">
    {requestNodes}
  </div>;
};

Requests.propTypes = {
  requestData: PropTypes.object.isRequired,
  activeRequest: PropTypes.object,
  contextRequest: PropTypes.object,
  labels: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleContextMenu: PropTypes.func.isRequired
};

import { setActiveRequest, setContextRequest } from '../../actions/requests.js';
import { getRequestData, getActiveRequest, getContextRequest } from '../../reducers/requests.js';
import { getLabels } from '../../reducers/app.js';

const mapStateToProps = (state) => ({
  requestData: getRequestData(state),
  labels: getLabels(state),
  activeRequest: getActiveRequest(state),
  contextRequest: getContextRequest(state)
});

const mapDispatchToProps = (dispatch) => ({
  handleClick: ({request, response}) => {
    dispatch(setActiveRequest({request, response, id: request.id}));
    dispatch(setContextRequest(null));
  },
  handleContextMenu: ({request}) => {
    dispatch(setContextRequest(request));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Requests);

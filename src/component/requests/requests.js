import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Request from './request.js';

const {object, array} = React.PropTypes;

class Requests extends Component {
  componentWillUpdate() {
    // remember scroll position for when list changes
    const node = findDOMNode(this);
    this.scrollHeight = node.scrollHeight;
    this.scrollTop = node.scrollTop;
  }

  componentDidUpdate() {
    // restore scroll position after list changes
    const node = findDOMNode(this);
    node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
  }

  render() {
    const {requestData, activeRequest, contextRequest, labels} = this.props;

    const requestNodes = requestData.requests.map(({request, response}) => {
      const isActive = activeRequest && activeRequest.id === request.id || false;
      const isContextMenu = contextRequest && contextRequest === request.id || false;

      return <Request
        request={request}
        response={response}
        done={request.done}
        isActive={isActive}
        isContextMenu={isContextMenu}
        labels={labels}
        key={request.id}
      />;
    });

    return <div className="requests">
      {requestNodes}
    </div>;
  }
}

Requests.propTypes = {
  requestData: object.isRequired,
  activeRequest: object,
  contextRequest: object,
  labels: array.isRequired
};

import { getRequestData, getActiveRequest, getContextRequest } from '../../reducers/requests.js';
import { getLabels } from '../../reducers/app.js';

const mapStateToProps = (state) => ({
  requestData: getRequestData(state),
  labels: getLabels(state),
  activeRequest: getActiveRequest(state),
  contextRequest: getContextRequest(state)
});

export default connect(mapStateToProps)(Requests);

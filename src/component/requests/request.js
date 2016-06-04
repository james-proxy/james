import React from 'react';
import { connect } from 'react-redux';

import FullUrl from './full-url.js';
import RequestContextMenu from './request-context-menu.js';
import RequestLabels from './request-labels.js';

const {func, array, object, bool} = React.PropTypes;

class Request extends React.Component {

  shouldComponentUpdate(nextProps) {
    return this.props.request.id !== nextProps.request.id ||
      this.props.isActive !== nextProps.isActive ||
      this.props.isContextMenu !== nextProps.isContextMenu ||
      this.done !== nextProps.request.done;
  }

  render() {
    const {
      labels,
      request,
      response,
      isActive,
      isContextMenu,
      handleClick,
      handleContextMenu
    } = this.props;

    this.done = request.done;

    let took = <i className="fa fa-gear fa-spin" />;
    if (request.took) {
      took = request.took + 'ms';
    }

    const requestClasses = ['request'];
    if (isActive) {
      requestClasses.push('request-active');
    }

    let contextMenuNode = null;
    if (isContextMenu) {
      const contextMenuProps = {
        request,
        handleContextMenu
      };
      contextMenuNode = <RequestContextMenu {...contextMenuProps} />;
    }

    return <div className={requestClasses.join(' ')}>
      { contextMenuNode }
      <div className="request-inner" onClick={handleClick} onContextMenu={handleContextMenu}>
        <span className="method property">{request.method}</span>
          <span className="time property">
            {took}
          </span>
          <span className="status-code property">
            {response.statusCode}
          </span>
        <FullUrl request={request} />
        <RequestLabels request={request} labels={labels} />
        <span className="fade-out" />
      </div>
    </div>;
  }
}

Request.propTypes = {
  labels: array.isRequired,
  request: object.isRequired,
  response: object.isRequired,
  isActive: bool,
  isContextMenu: bool,
  handleClick: func.isRequired,
  handleContextMenu: func.isRequired
};

import { setActiveRequest, setContextRequest } from '../../actions/requests.js';
import { isActiveRequest, isContextRequest } from '../../reducers/requests.js';
import { getLabels } from '../../reducers/app.js';

const mapStateToProps = (state, {request}) => ({
  isActive: isActiveRequest(state, request),
  isContextMenu: isContextRequest(state, request),
  labels: getLabels(state)
});

const mapDispatchToProps = (dispatch, {request, response}) => ({
  handleClick: () => {
    dispatch(setActiveRequest({request, response, id: request.id}));
    dispatch(setContextRequest(null));
  },
  handleContextMenu: () => {
    dispatch(setContextRequest(request.id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Request);

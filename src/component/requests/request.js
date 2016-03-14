import React from 'react';
import FullUrl from './full-url.js';
import RequestContextMenu from './request-context-menu.js';
import RequestLabels from './request-labels.js';

const {func, object, bool} = React.PropTypes;

export default class Request extends React.Component {

  shouldComponentUpdate(nextProps) {
    return this.props.request.id !== nextProps.request.id ||
      this.props.isActive !== nextProps.isActive ||
      this.props.isContextMenu !== nextProps.isContextMenu ||
      this.done !== nextProps.request.done;
  }

  render() {
    const {
      config,
      request,
      response,
      isActive,
      isContextMenu,
      toggleWindow,
      handleClick,
      handleContextMenu,
      removeUrlMapping,
      toggleUrlMappingActiveState
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
        toggleWindow,
        handleContextMenu,
        removeUrlMapping,
        toggleUrlMappingActiveState
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
        <RequestLabels request={request} labels={config.labels} />
        <span className="fade-out" />
      </div>
    </div>;
  }
}

Request.propTypes = {
  config: object.isRequired,
  request: object.isRequired,
  response: object.isRequired,
  isActive: bool.isRequired,
  isContextMenu: bool.isRequired,
  handleClick: func.isRequired,
  handleContextMenu: func.isRequired,
  toggleWindow: func.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

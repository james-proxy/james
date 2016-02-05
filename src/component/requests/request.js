import React from 'react';
import FullUrl from './full-url.js';
import RequestLabels from './request-labels.js';
import ContextMenu from '../context-menu/context-menu.js';

const {func, object, number, bool} = React.PropTypes;

export default class Request extends React.Component {

  shouldComponentUpdate(nextProps) {
    return this.props.request.id !== nextProps.request.id ||
      this.props.positionTop !== nextProps.positionTop ||
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
      showWindow,
      handleClick,
      handleContextMenu,
      positionTop,
      removeUrlMapping,
      toggleUrlMappingActiveState
    } = this.props;

    this.done = request.done;

    let took = <i className="fa fa-gear fa-spin"></i>;
    if (request.took) {
      took = request.took + 'ms';
    }

    const requestClasses = ['request'];
    if (isActive) {
      requestClasses.push('request-active');
    }

    const style = {
      top: positionTop
    };

    let contextMenuNode = null;
    if (isContextMenu) {
      const handleMenuClick = (fn) => (event) => {
        event.preventDefault();
        handleContextMenu();
        fn();
      };

      const contextMenuItems = [{
        title: 'Add mapping',
        icon: 'fa-plus',
        onClick: handleMenuClick(() => {
          showWindow('UrlMapping', {urlInput: request.originalUrl});
        })
      }];

      if (request.isMappedUrl) {
        contextMenuItems.push({
          title: 'Remove mapping',
          icon: 'fa-trash-o',
          onClick: handleMenuClick(() => {
            removeUrlMapping(request.originalUrl);
          })
        }, {
          title: 'Activate/Deactivate',
          icon: 'fa-toggle-on',
          onClick: handleMenuClick(() => {
            toggleUrlMappingActiveState(request.originalUrl);
          })
        });
      }

      contextMenuNode = <ContextMenu items={contextMenuItems} />;
    }

    return <div className={requestClasses.join(' ')} style={style}>
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
  showWindow: func.isRequired,
  positionTop: number.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

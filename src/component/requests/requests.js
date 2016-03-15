import React from 'react';
import Request from './request.js';

const {func, string, object} = React.PropTypes;

export default class Requests extends React.Component {

  render() {
    const {
      isActiveRequest,
      setActiveRequest,
      isContextMenuRequest,
      setContextMenuRequest,
      toggleWindow,
      config,
      requestData,
      removeUrlMapping,
      toggleUrlMappingActiveState
    } = this.props;

    const requestNodes = requestData.requests.map((request) => {
      const isActive = isActiveRequest(request);
      const isContextMenu = isContextMenuRequest(request);

      const handleClick = () => {
        setContextMenuRequest(null);
        setActiveRequest(request);
      };

      const handleContextMenu = () => {
        setContextMenuRequest(request);
      };

      return <Request
        {...request}
        isActive={isActive}
        isContextMenu={isContextMenu}
        config={config}
        toggleWindow={toggleWindow}
        handleClick={handleClick}
        handleContextMenu={handleContextMenu}
        key={request.request.id}
        removeUrlMapping={removeUrlMapping}
        toggleUrlMappingActiveState={toggleUrlMappingActiveState} />;
    });

    return <div className="requests">
      {requestNodes}
    </div>;
  }
}

Requests.propTypes = {
  requestData: object.isRequired,
  toggleWindow: func.isRequired,
  filter: string,
  isActiveRequest: func.isRequired,
  setActiveRequest: func.isRequired,
  isContextMenuRequest: func.isRequired,
  setContextMenuRequest: func.isRequired,
  config: object.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

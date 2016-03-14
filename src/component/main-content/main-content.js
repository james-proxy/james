import React from 'react';
import Requests from '../requests/requests.js';
import Search from '../search/search.js';
import InspectRequest from '../inspect-request/inspect-request.js';
import Welcome from './welcome.js';

const {func, object, arrayOf, shape, array} = React.PropTypes;

export default class MainContent extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      filter: null,
      activeRequest: null,
      contextMenuRequest: null
    };
  }

  setActiveRequest(request) {
    // update activeRequest to request (no toggle); use null to clear
    this.setState({activeRequest: request});
  }

  isActiveRequest(request) {
    if (!request || !this.state.activeRequest) {
      return false;
    }
    return this.state.activeRequest.request.id === request.request.id;
  }

  setContextMenuRequest(request) {
    // clear if no request, or current request provided (toggle)
    if (!request || request.request.id === this.state.contextMenuRequest) {
      this.setState({contextMenuRequest: null});
      return;
    }
    this.setState({contextMenuRequest: request.request.id});
  }

  isContextMenuRequest(request) {
    if (!request || !this.state.contextMenuRequest) {
      return false;
    }
    return this.state.contextMenuRequest === request.request.id;
  }

  onClick(event) {
    if (this.state.contextMenuRequest && !event.target.matches('.request *')) {
      this.setContextMenuRequest(undefined);
    }
  }

  render() {
    const {
      browsers,
      openBrowser,
      requestData,
      toggleWindow,
      config,
      activeWindow,
      filterRequests,
      removeUrlMapping,
      toggleUrlMappingActiveState
    } = this.props;

    const {activeRequest} = this.state;
    let search;
    let welcome;

    if (requestData.totalCount > 0) {
      search = <Search filterRequests={filterRequests} />;
    } else {
      welcome = <Welcome browsers={browsers} openBrowser={openBrowser} />;
    }

    let activeRequestNode = null;
    if (activeRequest) {
      activeRequestNode = <InspectRequest
        request={activeRequest}
        setActiveRequest={this.setActiveRequest.bind(this)} />;
    }

    return <div className="main-content" onClick={this.onClick} onContextMenu={this.onClick}>
      {activeWindow}
      <div className="header">
        {search}
      </div>
      {welcome}
      <Requests
        requestData={requestData}
        toggleWindow={toggleWindow}
        config={config}
        isActiveRequest={this.isActiveRequest.bind(this)}
        setActiveRequest={this.setActiveRequest.bind(this)}
        isContextMenuRequest={this.isContextMenuRequest.bind(this)}
        setContextMenuRequest={this.setContextMenuRequest.bind(this)}
        removeUrlMapping={removeUrlMapping}
        toggleUrlMappingActiveState={toggleUrlMappingActiveState} />
      {activeRequestNode}
    </div>;
  }
}

MainContent.propTypes = {
  openBrowser: func.isRequired,
  browsers: array.isRequired,
  toggleWindow: func.isRequired,
  filterRequests: func.isRequired,
  requests: arrayOf(shape({
    request: object,
    response: object
  })),
  config: object.isRequired,
  requestData: object.isRequired,
  activeWindow: object,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

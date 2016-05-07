import React from 'react';
import Requests from '../requests/requests.js';
import Search from '../search/search.js';
import InspectRequest from '../inspect-request/inspect-request.js';

const {func, object, arrayOf, shape} = React.PropTypes;

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
      requestData,
      config,
      filterRequests,
      removeUrlMapping,
      toggleUrlMappingActiveState
    } = this.props;

    const {activeRequest} = this.state;

    let search;
    if (requestData.totalCount > 0) {
      search = <Search filterRequests={filterRequests} />;
    }

    let activeRequestNode = null;
    if (activeRequest) {
      activeRequestNode = <InspectRequest
        request={activeRequest}
        setActiveRequest={this.setActiveRequest.bind(this)} />;
    }

    return <span onClick={this.onClick} onContextMenu={this.onClick}>
      <div className="header">
        {search}
      </div>
      <Requests
        requestData={requestData}
        config={config}
        isActiveRequest={this.isActiveRequest.bind(this)}
        setActiveRequest={this.setActiveRequest.bind(this)}
        isContextMenuRequest={this.isContextMenuRequest.bind(this)}
        setContextMenuRequest={this.setContextMenuRequest.bind(this)}
        removeUrlMapping={removeUrlMapping}
        toggleUrlMappingActiveState={toggleUrlMappingActiveState} />
      {activeRequestNode}
    </span>;
  }
}

MainContent.propTypes = {
  config: object.isRequired,
  requests: arrayOf(shape({
    request: object,
    response: object
  })),
  filterRequests: func.isRequired,
  requestData: object.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

import React from 'react';
import Requests from '../requests.js';
import Search from '../search';
import Welcome from './welcome.js';
import InspectRequest from '../inspect-request';

const {func, object, arrayOf, shape, array} = React.PropTypes;

export default class MainContent extends React.Component {

  constructor() {
    super();
  }

  componentWillMount() {
    this.setState({
      filter: null,
      activeRequest: null,
      contextMenuRequest: null
    });
  }

  setActiveRequest(request) {
    this.setState({activeRequest: request});
  }

  isActiveRequest(request) {
    if (!this.state.activeRequest || !request) {
      return false;
    }
    return this.state.activeRequest.request.id === request.request.id;
  }

  setContextMenuRequest(request) {
    if (!request || request.request.id === this.state.contextMenuRequest) {
      this.setState({contextMenuRequest: null});
      return;
    }
    this.setState({contextMenuRequest: request.request.id});
  }

  isContextMenuRequest(request) {
    if (!this.state.contextMenuRequest || !request) {
      return false;
    }
    return this.state.contextMenuRequest === request.request.id;
  }

  render() {
    const {
      browsers,
      openBrowser,
      requestData,
      showWindow,
      config,
      activeWindow,
      setFromIndex,
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

    return <div className="main-content">
      <div className="header">
        {search}
      </div>
      {activeWindow}
      {welcome}
      <Requests
        requestData={requestData}
        showWindow={showWindow}
        config={config}
        isActiveRequest={this.isActiveRequest.bind(this)}
        setActiveRequest={this.setActiveRequest.bind(this)}
        isContextMenuRequest={this.isContextMenuRequest.bind(this)}
        setContextMenuRequest={this.setContextMenuRequest.bind(this)}
        setFromIndex={setFromIndex}
        removeUrlMapping={removeUrlMapping}
        toggleUrlMappingActiveState={toggleUrlMappingActiveState} />
      {activeRequestNode}
    </div>;
  }
}

MainContent.propTypes = {
  openBrowser: func.isRequired,
  browsers: array.isRequired,
  showWindow: func.isRequired,
  setFromIndex: func.isRequired,
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

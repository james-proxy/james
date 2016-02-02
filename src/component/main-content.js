import React from 'react';
import Requests from './requests.js';
import Search from './search.js';
import InspectRequest from './inspect-request.js';
import Browser from './browser.js';

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
    console.log("setContextMenuRequest", request, this.state.contextMenuRequest);
    if (!request || request.request.id === this.state.contextMenuRequest) {
      console.log("set context menu to null");
      this.setState({contextMenuRequest: null});
      return;
    }
    console.log("set context menu to", request.request.id);
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
    let SearchBar;
    let SetupInstructions;

    if (requestData.totalCount > 0) {
      SearchBar = <Search filterRequests={filterRequests} />;
    } else {
      const browserElements = browsers.map((browser) => {
        return <Browser browserName={browser.name} key={browser.name} openBrowser={openBrowser} />;
      });

      SetupInstructions = <div className="setup-instruction">
        <h2>Proxy started on localhost:1338</h2>
        <h3>Launch a browser, using James as a proxy</h3>
        {browserElements}
      </div>;
    }

    let activeRequestNode = null;
    if (activeRequest) {
      activeRequestNode = <InspectRequest
        request={activeRequest}
        setActiveRequest={this.setActiveRequest.bind(this)} />;
    }

    return <div className="main-content">
      <div className="header">
        {SearchBar}
      </div>
      {activeWindow}
      {SetupInstructions}
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

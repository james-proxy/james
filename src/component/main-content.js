import React from 'react';
import Requests from './requests.js';
import Search from './search.js';
import InspectRequest from './inspect-request.js';

const {func, object, arrayOf, shape} = React.PropTypes;

export default class MainContent extends React.Component {

  constructor() {
    super();
  }

  componentWillMount() {
    this.setState({
      filter: null,
      activeRequest: null
    });
  }

  _openChrome() {
    const {openBrowser} = this.props;
    openBrowser('chrome');
  }

  _openFirefox() {
    const {openBrowser} = this.props;
    openBrowser('firefox');
  }

  render() {
    const {
      requestData,
      config,
      activeWindow,
      setFromIndex,
      filterRequests
    } = this.props;

    const {activeRequest} = this.state;
    let SearchBar;
    let SetupInstructions;

    const setActiveRequest = (request) => {
      this.setState({
        activeRequest: request
      });
    };

    let activeRequestNode = null;
    if (activeRequest) {
      activeRequestNode = <InspectRequest
        request={activeRequest}
        setActiveRequest={setActiveRequest} />;
    }

    if (requestData.totalCount > 0) {
      SearchBar = <Search filterRequests={filterRequests} />;
    } else {
      SetupInstructions = <div className="setup-instruction">
        <h2>Proxy started on localhost:1338</h2>

        <h3>Setup your browser to use James as proxy</h3>
        <span className="open-browser chrome"
              onClick={this._openChrome.bind(this)}></span>
        <span className="open-browser firefox"
              onClick={this._openFirefox.bind(this)}></span>
      </div>;
    }

    return <div className="main-content">
      <div className="header">
        {SearchBar}
        <div className="request-count">
          Requests: {requestData.totalCount}
        </div>
      </div>
      {activeWindow}
      {SetupInstructions}
      <Requests
        requestData={requestData}
        config={config}
        setActiveRequest={setActiveRequest}
        setFromIndex={setFromIndex} />
      {activeRequestNode}
    </div>;
  }
}

MainContent.propTypes = {
  openBrowser: func.isRequired,
  setFromIndex: func.isRequired,
  filterRequests: func.isRequired,
  requests: arrayOf(shape({
    request: object,
    response: object
  })),
  config: object.isRequired,
  requestData: object.isRequired,
  activeWindow: object
};

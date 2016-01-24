import React from 'react';
import Requests from './requests.js';
import Search from './search.js';
import InspectRequest from './inspect-request.js';

const {func, object, arrayOf, shape, array} = React.PropTypes;

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

  _openBrowserFactory(name) {
    const {openBrowser} = this.props;
    return function() {
      openBrowser(name);
    }
  }

  render() {
    const {
      browsers,
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
      const browserElements = browsers.map((browser) => {
        const src = './images/' + browser.name + '_128x128.png';
        return <img className="open-browser" src={src} key={browser.name}
                    onClick={this._openBrowserFactory(browser.name)} />
      });

      SetupInstructions = <div className="setup-instruction">
        <h2>Proxy started on localhost:1338</h2>

        <h3>Setup your browser to use James as proxy</h3>
        {browserElements}
      </div>;
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
        setActiveRequest={setActiveRequest}
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

import React from 'react';
import Requests from './requests.js'
import Search from './search.js'
import InspectRequest from './inspect-request.js'

const {func, object} = React.PropTypes;

export default class MainContent extends React.Component {

  constructor() {
    super();
  };

  componentWillMount() {
    this.setState({
      filter: null,
      activeRequest: null
    });
  }

  _setFilter(str) {
    if(str === '') {
      str = null;
    }
    this.setState({
      filter: str
    });
  }

  _filter(arr) {
    const filter = this.state.filter;
    if(!filter) {
      return arr;
    }
    return arr.filter((request) => {
      return request.request.fullUrl().indexOf(filter) !== -1;
    });
  }

  _setActiveRequest(request) {
    this.setState({
      activeRequest: request
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

    let {requests, config, services, activeWindow} = this.props;
    let {activeRequest} = this.state;
    let SearchBar, SetupInstructions;

    const setFilter = (str) => {
      this._setFilter(str);
      this.render();
    };

    const setActiveRequest = (request) => {
      this._setActiveRequest(request);
    };

    if(activeRequest) {
      activeRequest = <InspectRequest
        request={activeRequest}
        services={services}
        setActiveRequest={setActiveRequest}
      ></InspectRequest>;
    }

    if(requests.length > 0) {
      SearchBar = <Search setFilter={setFilter}></Search>;
    } else {
      SetupInstructions = <div className="setup-instruction">
        <h2>Proxy started on localhost:1338</h2>
        <h3>Setup your browser to use James as proxy</h3>
        <button onClick={this._openChrome.bind(this)}>Open Chrome</button>
        <button onClick={this._openFirefox.bind(this)}>Open Firefox</button>
      </div>;
    }

    return <div className="main-content">
      <div className="header">
        {SearchBar}
      </div>
      {activeWindow}
      {SetupInstructions}
      <Requests
        requests={this._filter(requests)}
        config={config}
        setActiveRequest={setActiveRequest}
      ></Requests>
      {activeRequest}
    </div>
  }
}

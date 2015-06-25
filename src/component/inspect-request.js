import React from 'react';
import FullUrl from './full-url.js';

const {func, object} = React.PropTypes;

export default class InspectRequest extends React.Component {

  componentWillMount() {
    this.setState({
      showUrlMapperWindow: false
    });
  }

  render() {

    const {request, setActiveRequest, services} = this.props;
    const close = () => {
      setActiveRequest(null);
    };

    const doShowUrlMapperWindow = () => {
      this.setState({
        showUrlMapperWindow: true
      });
    };

    const doHideUrlMapperWindow = () => {
      this.setState({
        showUrlMapperWindow: false
      });
    };

    let responseBody = request.response.body;

    const requestHeaders = Object.keys(request.request.headers).map(function(key) {
      const headerValue =  request.request.headers[key];
      return <li key={key}>
        <strong>{key}:&nbsp;</strong>
        {headerValue}
      </li>;
    });
    const responseHeaders = Object.keys(request.response.headers).map(function(key) {
      const headerValue =  request.response.headers[key];
      return <li key={key}>
        <strong>{key}:&nbsp;</strong>
        {headerValue}
      </li>;
    });

    return <div className="inspect-request">
      <div className="toolbar">
        <div className="toolbar-action primary" onClick={close}>
          <i className="action fa fa-close"></i>
          <span className="description">close</span>
        </div>
      </div>
      <div className="box-header">
        <div className="title">
          {request.request.hostname}
        </div>
      </div>
      <div className="box-body">
        <div className="section">
          Request URL:
          <code>
            <FullUrl request={request.request}></FullUrl>
          </code>
        </div>
        <div className="section">
          Request Headers:
          <code>
            <ul>
              {requestHeaders}
            </ul>
          </code>
        </div>
        <div className="section">
          Response Headers:
          <code>
            <ul>
              {responseHeaders}
            </ul>
          </code>
        </div>
      </div>
    </div>
  }
}

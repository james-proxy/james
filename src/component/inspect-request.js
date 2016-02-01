import React from 'react';
import FullUrl from './full-url.js';
import {KeyValue} from './inspect/key-value';

const {func, object} = React.PropTypes;

export default class InspectRequest extends React.Component {

  componentWillMount() {
    this.setState({
      showUrlMapperWindow: false
    });
  }

  render() {
    const {request, setActiveRequest} = this.props;
    const close = () => {
      setActiveRequest(null);
    };

    function keyValues(obj) {
      return Object.keys(obj).map((key) => <KeyValue key={key} _key={key} value={String(obj[key])} />);
    }

    const queryParams = keyValues(request.request.query);
    const requestHeaders = keyValues(request.request.headers);
    const responseHeaders = keyValues(request.response.headers);

    return <div className="inspect-request">
      <div className="toolbar">
        <div className="toolbar-action primary" onClick={close}>
          <i className="action fa fa-close" />
          <span className="description">close</span>
        </div>
      </div>
      <div className="box-header">
        <div className="title">
          {request.request.hostname}
        </div>
      </div>
      <div className="box-body">
        <section>
          Request URL:
          <code>
            <FullUrl request={request.request} />
          </code>
        </section>
        <section>
          Request Query Parameters:
          {queryParams}
        </section>
        <section>
          Request Headers:
          {requestHeaders}
        </section>
        <section>
          Response Headers:
          {responseHeaders}
        </section>
      </div>
    </div>;
  }
}


InspectRequest.propTypes = {
  request: object.isRequired,
  setActiveRequest: func.isRequired
};

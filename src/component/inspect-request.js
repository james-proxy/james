import React from 'react';
import FullUrl from './full-url.js';
import KeyValue from './inspect/key-value';

const {func, object} = React.PropTypes;

export default class InspectRequest extends React.Component {

  constructor() {
    super();
    this._onResize = this._onResize.bind(this);
  }

  _getMaxHeight() {
    return window.innerHeight * 0.6 - 100;
  }

  _onResize() {
    const maxHeight = this._getMaxHeight();
    this.setState({maxHeight});
  }

  componentWillMount() {
    this.setState({
      showUrlMapperWindow: false,
      maxHeight: this._getMaxHeight()
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  render() {
    const {maxHeight} = this.state;
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

    const bodyStyle = {maxHeight};

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
      <div className="box-body" style={bodyStyle}>
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

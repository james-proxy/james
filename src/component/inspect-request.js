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
        <FullUrl request={request.request}></FullUrl>
      </div>
    </div>
  }
}

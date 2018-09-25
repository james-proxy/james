import React from 'react';
import PropTypes from 'prop-types';

import RequestMetadata from './request-metadata.js';
import RequestBody from './request-body.js';
import FullUrl from '../requests/full-url.js';

export default class RequestDetails extends React.Component {
  constructor(props) {
    super(props);
    this._onResize = this._onResize.bind(this);
    this.state = {
      maxHeight: this._getMaxHeight()
    };
  }

  _getMaxHeight() {
    // 60% of window height, minus buffer to account for header/footer
    return window.innerHeight * 0.6 - 100;
  }

  _onResize() {
    const maxHeight = this._getMaxHeight();
    this.setState({maxHeight});
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  render() {
    const {request} = this.props;
    const {maxHeight} = this.state;
    const bodyStyle = {maxHeight};

    return <div className="box-body" style={bodyStyle}>
      <FullUrl request={request.request} title="Request URL"/>
      <RequestMetadata metadata={request.request.query} title="Request Query Params"/>
      <RequestMetadata metadata={request.request.headers} title="Request Headers"/>
      <RequestBody body={request.request.body} title="Request Body"/>
      {request.response.body ?
        [
          <RequestMetadata metadata={request.response.headers} title="Response Headers"/>,
          <RequestBody body={request.response.body} title="Response Body"/>
        ]
        : null
      }
    </div>;
  }
}

RequestDetails.propTypes = {
  request: PropTypes.object.isRequired
};

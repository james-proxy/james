import React from 'react';
import PropTypes from 'prop-types';

import RequestMetadata from './request-metadata.js';
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
      <section>
        Request URL:
        <FullUrl request={request.request} />
      </section>
      <section>
        Request Query Params:
        <RequestMetadata metadata={request.request.query} />
      </section>
      <section>
        Request Headers:
        <RequestMetadata metadata={request.request.headers} />
      </section>
      <section>
        Response Headers:
        <RequestMetadata metadata={request.response.headers} />
      </section>
    </div>;
  }
}

RequestDetails.propTypes = {
  request: PropTypes.object.isRequired
};

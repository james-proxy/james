import React, {PropTypes} from 'react';

import constants from '../../../constants.js';
import RequestDetailsHeaders from './headers.js';
import RequestDetailsResponse from './response.js';

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
    const {request, tab} = this.props;
    const {maxHeight} = this.state;
    const bodyStyle = {maxHeight};

    let body = null;
    switch (tab) {
    case constants.REQUEST_DETAILS_TAB_HEADERS:
    default:
      body = <RequestDetailsHeaders request={request} />;
      break;
    case constants.REQUEST_DETAILS_TAB_RESPONSE:
      body = <RequestDetailsResponse request={request} />;
      break;
    }

    return <div className="box-body" style={bodyStyle}>
      {body}
    </div>;
  }
}

RequestDetails.propTypes = {
  request: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired
};

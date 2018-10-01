import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from './toolbar.js';
import RequestDetails from './request-details.js';

const InspectRequest = (props) => {
  const {request, clearActiveRequest} = props;

  const actions = [
    {
      description: 'close',
      icon: 'fa-close',
      onClick: () => { clearActiveRequest(); }
    }
  ];

  let node = null;

  if (request) {
    node = <div className="inspect-request">
      <Toolbar actions={actions} />
      <div className="box-header">
        <div className="title">
          {request.request.hostname}
        </div>
      </div>
      <RequestDetails request={request} />
    </div>;
  }

  return node;
};

InspectRequest.propTypes = {
  request: PropTypes.object,
  clearActiveRequest: PropTypes.func.isRequired
};

import { setActiveRequest } from '../../../common/actions/requests.js';
import { getActiveRequest } from '../../reducers/requests.js';

const mapStateToProps = (state) => ({
  request: getActiveRequest(state)
});

const mapDispatchToProps = (dispatch) => ({
  clearActiveRequest: () => dispatch(setActiveRequest(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(InspectRequest);

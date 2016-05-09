import React from 'react';
import { connect } from 'react-redux';

import Toolbar from './toolbar.js';
import RequestDetails from './request-details.js';

const {func, object} = React.PropTypes;

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
  request: object,
  clearActiveRequest: func.isRequired
};

import { setActiveRequest } from '../../actions/requests.js';

const mapStateToProps = (state) => ({
  request: state.requests.active
});

const mapDispatchToProps = (dispatch) => ({
  clearActiveRequest: () => dispatch(setActiveRequest(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(InspectRequest);

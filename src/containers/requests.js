import React from 'react';
import { connect } from 'react-redux';

import NoRequests from '../component/requests/no-requests.js';
import Search from '../component/requests/search.js';
import Requests from '../component/requests/requests.js';
import InspectRequest from '../component/inspect-request/inspect-request.js';

const {func, object} = React.PropTypes;

const RequestsContainer = (props) => {
  const {
    requestData,
    clearContextRequest
  } = props;

  const handleClick = (evt) => {
    if (evt.target.matches('.request *')) return;
    clearContextRequest();
  };

  let output = <NoRequests />;

  if (requestData.totalCount > 0) {
    output = <span onClick={handleClick} onContextMenu={handleClick}>
      <div className="header">
        <Search />
      </div>
      <Requests requestData={requestData} />
      <InspectRequest />
    </span>;
  }

  return output;
};

RequestsContainer.propTypes = {
  requestData: object.isRequired,
  clearContextRequest: func.isRequired
};


import { setContextRequest } from '../actions/requests.js';

const mapStateToProps = (store) => ({
  requestData: store.requests.data,
  contextMenuRequest: store.requests.context
});

const mapDispatchToProps = (dispatch) => ({
  clearContextRequest: () => dispatch(setContextRequest(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsContainer);

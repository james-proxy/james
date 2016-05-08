import React from 'react';
import { connect } from 'react-redux';

import Search from '../component/requests/search.js';
import Requests from '../component/requests/requests.js';
import InspectRequest from '../component/inspect-request/inspect-request.js';

const {func, object} = React.PropTypes;

const RequestsContainer = (props) => {
  const {
    config,
    requestData,
    clearContextRequest
  } = props;

  const handleClick = (evt) => {
    if (evt.target.matches('.request *')) return;
    clearContextRequest();
  };

  let search;
  if (requestData.totalCount > 0) {
    search = <Search />;
  }

  return <span onClick={handleClick} onContextMenu={handleClick}>
    <div className="header">
      {search}
    </div>
    <Requests requestData={requestData} config={config} />
    <InspectRequest />
  </span>;
};

RequestsContainer.propTypes = {
  config: object.isRequired,
  requestData: object.isRequired,
  clearContextRequest: func.isRequired
};

import { setContextRequest } from '../actions/requests.js';
import proxy from '../proxy.js';

const mapStateToProps = (store) => ({
  requestData: proxy.getRequestData(store.requests.filter),
  contextMenuRequest: store.requests.context
});

const mapDispatchToProps = (dispatch) => ({
  clearContextRequest: () => dispatch(setContextRequest(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsContainer);

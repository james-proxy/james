import React from 'react';
import { connect } from 'react-redux';

const {object, func} = React.PropTypes;

const RequestCount = ({requestData, clearRequests}) => {
  const {filteredCount, totalCount} = requestData;
  return <div className="request-count">
    <button title="Clear all requests" onClick={clearRequests}>
      <i className="fa fa-ban" />
    </button>
    {`Requests: ${filteredCount} / ${totalCount}`}
  </div>;
};

RequestCount.propTypes = {
  requestData: object.isRequired,
  clearRequests: func.isRequired
};


import { clearRequests } from '../../actions/proxy.js';
import { getRequestData } from '../../reducers/requests.js';

const mapStateToProps = (state) => ({
  requestData: getRequestData(state)
});

const mapDispatchToProps = {
  clearRequests
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestCount);

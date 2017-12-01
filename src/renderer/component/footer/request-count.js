import React from 'react';
import PropTypes from 'prop-types';

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
  requestData: PropTypes.object.isRequired,
  clearRequests: PropTypes.func.isRequired
};

export default RequestCount;


import React from 'react';
import PropTypes from 'prop-types';

const RequestCount = ({filteredRequestCount, totalRequestCount, clearRequests}) => {
  return <div className="request-count">
    <button title="Clear all requests" onClick={clearRequests}>
      <i className="fa fa-ban" />
    </button>
    {`Requests: ${filteredRequestCount} / ${totalRequestCount}`}
  </div>;
};

RequestCount.propTypes = {
  filteredRequestCount: PropTypes.number.isRequired,
  totalRequestCount: PropTypes.number.isRequired,
  clearRequests: PropTypes.func.isRequired
};

export default RequestCount;


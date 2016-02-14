import React from 'react';

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

export default RequestCount;

import React from 'react';

const {object, func} = React.PropTypes;

export const RequestCount = ({requestData, clearRequests}) => {
  const {filteredCount, totalCount} = requestData;
  return <div className="request-count">
    {`Requests: ${filteredCount} / ${totalCount}`}
    <button title="Clear all requests" onClick={clearRequests}>
      <i className="fa fa-ban" />
    </button>
  </div>;
};

RequestCount.propTypes = {
  requestData: object.isRequired,
  clearRequests: func.isRequired
};

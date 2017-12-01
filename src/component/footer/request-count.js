import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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


import { clearRequests } from '../../actions/proxy.js';
import { getRequestData } from '../../reducers/requests.js';

const mapStateToProps = (state) => ({
  requestData: getRequestData(state)
});

const mapDispatchToProps = {
  clearRequests
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestCount);

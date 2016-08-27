import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import NoRequests from '../component/requests/no-requests.js';
import Search from '../component/requests/search.js';
import Requests from '../component/requests/requests.js';
import InspectRequest from '../component/inspect-request/inspect-request.js';

const RequestsContainer = ({hasRequests, clearContextRequest}) => {
  const handleClick = (evt) => {
    if (evt.target.matches('.request *')) return;
    clearContextRequest();
  };

  let output = <NoRequests />;

  if (hasRequests) {
    output = <span onClick={handleClick} onContextMenu={handleClick}>
      <div className="header">
        <Search />
      </div>
      <Requests />
      <InspectRequest />
    </span>;
  }

  return output;
};

RequestsContainer.propTypes = {
  hasRequests: PropTypes.bool.isRequired,
  clearContextRequest: PropTypes.func.isRequired
};


import { setContextRequest } from '../actions/requests.js';
import { hasRequests } from '../reducers/requests.js';

const mapStateToProps = (state) => ({
  hasRequests: hasRequests(state)
});

const mapDispatchToProps = (dispatch) => ({
  clearContextRequest: () => dispatch(setContextRequest(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestsContainer);

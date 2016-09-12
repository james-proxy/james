import React, { PropTypes } from 'react';

const RequestDetailsResponse = ({request}) => {
  return <span>
    <code>
      { request.response.body }
    </code>
  </span>;
};

RequestDetailsResponse.propTypes = {
  request: PropTypes.object.isRequired
};

export default RequestDetailsResponse;

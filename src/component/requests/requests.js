import React from 'react';
import Request from './request.js';

const {object} = React.PropTypes;

const Requests = ({requestData}) => {
  const requestNodes = requestData.requests.map((request) =>
    <Request
      {...request}
      key={request.request.id + request.request.done}
    />
  );

  return <div className="requests">
    {requestNodes}
  </div>;
};

Requests.propTypes = {
  requestData: object.isRequired
};

export default Requests;

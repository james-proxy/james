import React from 'react';
import Request from './request.js';

const {object} = React.PropTypes;

const Requests = ({config, requestData}) => {
  const requestNodes = requestData.requests.map((request) =>
    <Request
      {...request}
      config={config}
      key={request.request.id}
    />
  );

  return <div className="requests">
    {requestNodes}
  </div>;
};

Requests.propTypes = {
  requestData: object.isRequired,
  config: object.isRequired
};

export default Requests;

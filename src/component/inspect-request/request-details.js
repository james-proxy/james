import React from 'react';
import RequestHeaders from './request-headers.js';
import FullUrl from '../request/full-url.js';

const {object} = React.PropTypes;

const RequestDetails = (props) => {
  const {request} = props;

  return <div className="box-body">
    <section>
      Request URL:
      <FullUrl request={request.request} />
    </section>
    <section>
      Request Query Params:
      <RequestHeaders headers={request.request.query} />
    </section>
    <section>
      Request Headers:
      <RequestHeaders headers={request.request.headers} />
    </section>
    <section>
      Response Headers:
      <RequestHeaders headers={request.response.headers} />
    </section>
  </div>;
};

RequestDetails.propTypes = {
  request: object.isRequired
};

export default RequestDetails;

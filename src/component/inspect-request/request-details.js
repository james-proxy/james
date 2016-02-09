import React from 'react';
import RequestMetadata from './request-metadata.js';
import FullUrl from '../requests/full-url.js';

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
      <RequestMetadata metadata={request.request.query} />
    </section>
    <section>
      Request Headers:
      <RequestMetadata metadata={request.request.headers} />
    </section>
    <section>
      Response Headers:
      <RequestMetadata metadata={request.response.headers} />
    </section>
  </div>;
};

RequestDetails.propTypes = {
  request: object.isRequired
};

export default RequestDetails;

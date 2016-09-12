import React, { PropTypes } from 'react';

import RequestMetadata from './request-metadata.js';
import FullUrl from '../../requests/full-url.js';

const RequestDetailsHeaders = ({request}) => {
  return <span>
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
  </span>;
};

RequestDetailsHeaders.propTypes = {
  request: PropTypes.object.isRequired
};

export default RequestDetailsHeaders;

import React from 'react';

const {object} = React.PropTypes;

const RequestHeaders = (props) => {
  const {headers} = props;
  const headerNodes = Object.keys(headers).map((key) => {
    return <li key={key}>
      <strong>{key}:&nbsp;</strong>
      {headers[key]}
    </li>;
  });

  return <ul className="request-headers">{headerNodes}</ul>;
};

RequestHeaders.propTypes = {
  headers: object.isRequired
};

export default RequestHeaders;

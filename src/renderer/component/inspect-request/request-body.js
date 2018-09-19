import React from 'react';
import PropTypes from 'prop-types';

const RequestBody = (props) => {
  const { body, title } = props;

  if (!body.string || body.string === '') {
    return null;
  }

  return <section>
    <h3>{title}</h3>
    <div className="request-metadata">
      {body.string}
    </div>
  </section>;
};

RequestBody.propTypes = {
  body: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default RequestBody;

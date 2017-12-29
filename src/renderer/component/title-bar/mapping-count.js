import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const MappingCount = ({ urlMapCount }) => {
  if (!urlMapCount) return null;
  return <span className="label default">
    {urlMapCount}
  </span>;
};

MappingCount.propTypes = {
  urlMapCount: PropTypes.number.isRequired
};

import { getMappingCount } from '../../reducers/url-mappings.js';

const mapStateToProps = (state) => ({
  urlMapCount: getMappingCount(state)
});

export default connect(mapStateToProps)(MappingCount);

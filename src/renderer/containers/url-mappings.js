import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NewMapping from '../component/mapping/new-mapping.js';
import UrlMapping from '../component/mapping/url-mapping.js';
import InspectMapping from '../component/inspect-mapping/inspect-mapping.js';

const UrlMappingsContainer = (props) => {
  const {
    urlMappings,
    setUrlMapping,
    toggleUrlMapping,
    removeUrlMapping,
    setSelectedMapping
  } = props;

  const urlMappingNodes = urlMappings.map((mapping, index) => {
    return <UrlMapping key={index}
      mapping={mapping}
      toggleActive={toggleUrlMapping}
      remove={removeUrlMapping}
      edit={setSelectedMapping}
    />;
  });

  return <div className="url-mapping-window">
    <div className="url-mapping-header">
      <NewMapping saveMapping={setUrlMapping} />
    </div>
    <div className="url-mapping-footer">
      <ul className="collection with-header">
        {urlMappingNodes}
      </ul>
    </div>
    <InspectMapping/>
  </div>;
};

UrlMappingsContainer.propTypes = {
  urlMappings: PropTypes.array.isRequired,
  setUrlMapping: PropTypes.func.isRequired,
  toggleUrlMapping: PropTypes.func.isRequired,
  removeUrlMapping: PropTypes.func.isRequired,
  setSelectedMapping: PropTypes.func.isRequired
};


import { setUrlMapping, toggleUrlMapping, removeUrlMapping, setSelectedMapping } from '../../common/actions/url-mappings.js';
import { getMappings } from '../reducers/url-mappings.js';

const mapStateToProps = (state) => ({
  urlMappings: getMappings(state)
});

const mapDispatchToProps = {
  setUrlMapping,
  toggleUrlMapping,
  removeUrlMapping,
  setSelectedMapping
};

export default connect(mapStateToProps, mapDispatchToProps)(UrlMappingsContainer);

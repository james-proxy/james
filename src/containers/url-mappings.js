import React from 'react';
import { connect } from 'react-redux';

import NewMapping from '../component/mapping/new-mapping.js';
import UrlMapping from '../component/mapping/url-mapping.js';

const UrlMappings = (props) => {
  const {
    urlMappings,
    setUrlMapping,
    toggleUrlMapping,
    removeUrlMapping
  } = props;

  const urlMappingNodes = urlMappings.map((mapping, index) => {
    return <UrlMapping key={index}
              mapping={mapping}
              toggleActive={toggleUrlMapping}
              remove={removeUrlMapping}
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
  </div>;
};

UrlMappings.propTypes = {
  urlMappings: React.PropTypes.array.isRequired,
  setUrlMapping: React.PropTypes.func.isRequired,
  toggleUrlMapping: React.PropTypes.func.isRequired,
  removeUrlMapping: React.PropTypes.func.isRequired
};


import { setUrlMapping, toggleUrlMapping, removeUrlMapping } from '../actions/url-mappings.js';
import { getMappings } from '../reducers/url-mappings.js';

const mapStateToProps = (state) => ({
  urlMappings: getMappings(state)
});

const mapDispatchToProps = {
  setUrlMapping,
  toggleUrlMapping,
  removeUrlMapping
};

export default connect(mapStateToProps, mapDispatchToProps)(UrlMappings);

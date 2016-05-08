import React from 'react';
import { connect } from 'react-redux';

import urlMapper from '../url-mapper.js';

import NewMapping from '../component/mapping/new-mapping.js';
import UrlMapping from '../component/mapping/url-mapping.js';

const setUrlMapping = urlMapper.set.bind(urlMapper);
const removeUrlMapping = urlMapper.remove.bind(urlMapper);
const toggleUrlMappingIsActive = urlMapper.toggleActiveState.bind(urlMapper);

const UrlMappings = ({urlMappings, urlInput}) => {
  const urlMappingNodes = urlMappings.map((mapping, index) => {
    return <UrlMapping key={index}
              mapping={mapping}
              toggleActive={toggleUrlMappingIsActive}
              remove={removeUrlMapping}
            />;
  });

  return <div className="url-mapping-window">
    <div className="url-mapping-header">
      <NewMapping target={urlInput} saveMapping={setUrlMapping} />
    </div>
    <div className="url-mapping-footer">
      <ul className="collection with-header">
        {urlMappingNodes}
      </ul>
    </div>
  </div>;
};

UrlMappings.defaultProps = {
  urlInput: ''
};

UrlMappings.propTypes = {
  urlInput: React.PropTypes.string,
  urlMappings: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  urlMappings: state.urlMappings.mappings
});

export default connect(mapStateToProps)(UrlMappings);

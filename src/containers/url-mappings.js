import React from 'react';

import UrlMappingWindow from '../component/mapping/url-mapping-window.js';

const UrlMappings = (props) => {
  const {data, urlMapper} = props;

  return <UrlMappingWindow
    urlMappings={data.urlMappings}
    setUrlMapping={urlMapper.set.bind(urlMapper)}
    removeUrlMapping={urlMapper.remove.bind(urlMapper)}
    toggleUrlMappingIsActive={urlMapper.toggleActiveState.bind(urlMapper)}
  />;
};

UrlMappings.propTypes = {
  data: React.propTypes.object.isRequired,
  urlMapper: React.propTypes.object.isRequired
};

export default UrlMappings;

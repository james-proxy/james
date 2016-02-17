import React from 'react';

import TitleBar from './title-bar/title-bar.js';
import Footer from './footer/footer.js';
import MainContent from './main-content/main-content.js';

const AppContainer = (props) => {
  const {
    data, config,
    toggleWindow, devTools, activeWindow,
    urlMapper, requestData, filterRequests, clearRequests,
    isCachingEnabled, toggleCaching, toggleThrottle, throttleRateChange, enabled, rate
  } = props;

  return <div className="container">
    <TitleBar
      urlMapCount={data.urlMapCount}
      toggleWindow={toggleWindow}
      openDevTools={devTools.toggle.bind(devTools)} />
    <MainContent
      toggleWindow={toggleWindow}
      activeWindow={activeWindow}
      requestData={requestData}
      filterRequests={filterRequests}
      config={config}
      removeUrlMapping={urlMapper.remove.bind(urlMapper)}
      toggleUrlMappingActiveState={urlMapper.toggleActiveState.bind(urlMapper)} />
    <Footer
      isCachingEnabled={isCachingEnabled}
      requestData={requestData}
      clearRequests={clearRequests}
      toggleCaching={toggleCaching}
      toggleThrottle={toggleThrottle}
      onRateChange={throttleRateChange}
      proxyStatus={data.proxyStatus}
      enabled={enabled}
      rate={rate} />
  </div>;
};

export default AppContainer;

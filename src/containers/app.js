import React from 'react';

import TitleBar from '../component/title-bar/title-bar.js';
import Footer from '../component/footer/footer.js';

const AppContainer = ({data, requestData, clearRequests, children}) => {
  return <div>
    <TitleBar
      urlMapCount={data.urlMapCount} />
    <div className="main-content">
      {children}
    </div>
    <Footer
      requestData={requestData}
      clearRequests={clearRequests} />
  </div>;
};

AppContainer.propTypes = {
  data: React.propTypes.object.isRequired,
  requestData: React.propTypes.object.isRequired,
  clearRequests: React.propTypes.func.isRequired,
  children: React.propTypes.node
};

export default AppContainer;

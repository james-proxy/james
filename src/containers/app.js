import React from 'react';

import TitleBar from '../component/title-bar/title-bar.js';
import Footer from '../component/footer/footer.js';

const AppContainer = ({data, children}) => {
  return <div>
    <TitleBar
      urlMapCount={data.urlMapCount} />
    <div className="main-content">
      {children}
    </div>
    <Footer />
  </div>;
};

AppContainer.propTypes = {
  data: React.PropTypes.object.isRequired,
  children: React.PropTypes.node
};

export default AppContainer;

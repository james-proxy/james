import React from 'react';

import TitleBar from '../component/title-bar/title-bar.js';
import Footer from '../component/footer/footer.js';

const AppContainer = ({children}) => {
  return <div>
    <TitleBar />
    <div className="main-content">
      {children}
    </div>
    <Footer />
  </div>;
};

AppContainer.propTypes = {
  children: React.PropTypes.node
};

export default AppContainer;

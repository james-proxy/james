import React from 'react';
import PropTypes from 'prop-types';

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
  children: PropTypes.node
};

export default AppContainer;

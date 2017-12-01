import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import TitleBar from '../component/title-bar/title-bar.js';
import Footer from '../component/footer/footer.js';

const AsyncRoute = container => Loadable({
  loader: () => import(`./${container}.js`),
  loading: () => null
});

const AppContainer = () => {
  return <Fragment>
    <TitleBar />
    <div className="main-content">
      <Route exact path="/" component={AsyncRoute('home')} />
      <Route path="/requests" component={AsyncRoute('requests')} />
      <Route path="/url-mappings" component={AsyncRoute('url-mappings')} />
    </div>
    <Footer />
  </Fragment>
};

export default AppContainer;

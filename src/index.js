import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { push } from 'react-router-redux';

import Keyboard from './service/keyboard.js';
import ravenInit from './service/raven.js';

import store, { history } from './store/index.js';

import config from './config.js';
import createMenu from './menu.js';

import proxy, { filterRequests, clearRequests } from './proxy.js';
import urlMapper, { data } from './url-mapper.js';

import { init, toggleDevTools } from './actions/app.js';

ravenInit();

const keyboard = new Keyboard();
const toggleTools = () => store.dispatch(toggleDevTools());
const openUrlMappings = () => { store.dispatch(push('/url-mappings'));};

keyboard.register('F12', toggleTools);
keyboard.register('Ctrl+Shift+I', toggleTools);
keyboard.register('CommandOrControl+Alt+I', toggleTools);
keyboard.register('CommandOrControl+Alt+U', toggleTools);
keyboard.register('CommandOrControl+U', openUrlMappings);

const domNode = document.querySelector('#app');

import AppContainer from './containers/app.js';
import Home from './containers/home.js';
import Requests from './containers/requests.js';
import UrlMappings from './containers/url-mappings.js';

function render(initial) {
  const requestData = proxy.getRequestData(data.filter);

  data.urlMapCount = urlMapper.count();

  const appProps = {
    data, config,
    urlMapper, requestData, filterRequests, clearRequests,
    removeUrlMapping: urlMapper.remove.bind(urlMapper),
    toggleUrlMappingActiveState: urlMapper.toggleActiveState.bind(urlMapper)
  };

  const derp = (Component) => { // TODO: temp until I finish wiring things up
    const Wrapper = ({children}) => {
      return <Component {...appProps}>{children}</Component>;
    };
    Wrapper.propTypes = { // ...just for you, eslint
      children: React.propTypes.node
    };
    return Wrapper;
  };

  if (!initial) return; // TODO: react-router doesn't like to be re-rendered. WIP

  // TODO: extract routes, once derp is no longer necessary
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={derp(AppContainer)}>
          <IndexRoute component={Home} />
          <Route path="/requests" component={derp(Requests)} />
          <Route path="/url-mappings" component={derp(UrlMappings)}/>
        </Route>
      </Router>
    </Provider>
  , domNode);
}

createMenu();
store.dispatch(init());
render(true);

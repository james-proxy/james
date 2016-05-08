import Datastore from 'nedb';
import remote from 'remote';
const app = remote.require('app');

import store from './store/index.js';
import { render as renderAction } from './actions/app.js';
import UrlMapper from './service/url-mapper.js';

const db = new Datastore({
  filename: app.getPath('userData') + '/data.nedb',
  autoload: true
});

export const data = {
  urlMapCount: 0,   // in use by title-bar
  urlMappings: []  // in use by mappings view
};

const render = () => {
  // TODO: replace this with something that makes actual sense
  store.dispatch(renderAction());
};

const urlMapper = new UrlMapper(db, function() {
  data.urlMappings = urlMapper.mappings();
  render();
});

export default urlMapper;

import Datastore from 'nedb';
import remote from 'remote';
const app = remote.require('app');

import UrlMapper from './service/url-mapper.js';

const db = new Datastore({
  filename: app.getPath('userData') + '/data.nedb',
  autoload: true
});

export const data = {
  urlMapCount: 0,   // in use by title-bar
  urlMappings: [],  // in use by mappings view
  filter: null
};

const urlMapper = new UrlMapper(db, function() {
  data.urlMappings = urlMapper.mappings();
  render();
});

export default urlMapper;

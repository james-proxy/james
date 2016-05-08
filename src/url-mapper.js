import Datastore from 'nedb';
import remote from 'remote';
const app = remote.require('app');

import UrlMapper from './service/url-mapper.js';

import store from './store/index.js';
import { syncUrlMappings } from './actions/url-mappings.js';

const db = new Datastore({
  filename: app.getPath('userData') + '/data.nedb',
  autoload: true
});

const handleUpdate = () => {
  store.dispatch(syncUrlMappings(urlMapper.mappings()));
};

const urlMapper = new UrlMapper(db, handleUpdate);

export default urlMapper;

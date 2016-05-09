import Datastore from 'nedb';
import remote from 'remote';
const app = remote.require('app');

import UrlMapper from './service/url-mapper.js';

const db = new Datastore({
  filename: app.getPath('userData') + '/data.nedb',
  autoload: true
});

export default (handleUpdate) => {
  const urlMapper = new UrlMapper(db, handleUpdate);
  return urlMapper;
};

import Datastore from 'nedb';
import { remote } from 'electron';
const { app } = remote;

import constants from './constants.js';
import UrlMapper from './service/url-mapper.js';

const db = new Datastore({
  filename: app.getPath('userData') + `${constants.USER_DATA}/data.nedb`,
  autoload: true
});

export default (handleUpdate) => {
  const urlMapper = new UrlMapper(db, handleUpdate);
  return urlMapper;
};

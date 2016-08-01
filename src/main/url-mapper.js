import Datastore from 'nedb';
import EventEmitter from 'events';

import UrlMapper from '../service/url-mapper.js';

class UrlMapperHandler extends EventEmitter {
  constructor(config) {
    super();

    this.db = new Datastore(config);
    this.urlMapper = new UrlMapper(
      this.db,
      this.onUpdate_.bind(this)
    );
  }

  onUpdate_() {
    this.emit('update', {
      mappings: this.urlMapper.mappings()
    });
  }
}

export default function createUrlMapper(config) {
  return new UrlMapperHandler(config);
}

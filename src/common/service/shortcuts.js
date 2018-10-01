import Keyboard from './keyboard.js';

import { toggleDevTools } from './dev-tools.js';
import { showAddUrlMapping } from '../actions/url-mappings.js';

export default (store) => {
  const keyboard = new Keyboard();

  const toggleTools = () => {
    toggleDevTools();
  };
  const openUrlMappings = () => {
    store.dispatch(showAddUrlMapping());
  };

  keyboard.register('F12', toggleTools);
  keyboard.register('Ctrl+Shift+I', toggleTools);
  keyboard.register('CommandOrControl+Alt+I', toggleTools);
  keyboard.register('CommandOrControl+Alt+U', toggleTools);
  keyboard.register('CommandOrControl+U', openUrlMappings);
};

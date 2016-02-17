export const LAUNCH_BROWSER = 'LAUNCH_BROWSER';
export const SHOW_WINDOW = 'SHOW_WINDOW';
export const CLOSE_WINDOW = 'CLOSE_WINDOW';
export const SHOW_DEVTOOLS = 'SHOW_DEVTOOLS';
export const SHOW_URL_MAPPINGS = 'SHOW_URL_MAPPINGS';

export function launchBrowser(browserName) {
  return {
    type: LAUNCH_BROWSER,
    browserName
  };
}

export function openWindow(windowId) {
  return {
    type: OPEN_WINDOW,
    windowId
  };
}

export function closeWindow(windowId) {
  return {
    type: CLOSE_WINDOW,
    windowId
  };
}

export function showDevtools() {
  return {
    type: SHOW_DEVTOOLS
  };
}

export function showUrlMappings() {
  return {
    type: SHOW_URL_MAPPINGS
  };
}

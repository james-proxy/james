export const SET_REQUEST_FILTER = 'SET_REQUEST_FILTER';

export function setRequestFilter(filter = '') {
  return {
    type: SET_REQUEST_FILTER,
    filter
  };
}

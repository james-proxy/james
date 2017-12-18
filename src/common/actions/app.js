import { push } from 'react-router-redux';

export const INIT = 'INIT';
export const SET_UPDATER_STATUS = 'SET_UPDATER_STATUS';

export function init(data) {
  return (dispatch) => {
    dispatch({
      type: INIT,
      ...data
    });

    dispatch(navigateToHome());
  };
}

export function setUpdaterStatus({status, info}) {
  return {
    type: SET_UPDATER_STATUS,
    status,
    info
  };
}

export function navigateToHome() {
  return push('/');
}

export function navigateToRequests() {
  return push('/requests');
}

export function navigateToUrlMappings() {
  return push('/url-mappings');
}

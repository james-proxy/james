import React from 'react';
import { connect } from 'react-redux';

import constants from '../../constants.js';
import Toolbar from './toolbar.js';
import RequestDetails from './request-details/request-details.js';

const {func, object} = React.PropTypes;

const InspectRequest = (props) => {
  const {request, activeTab, clearActiveRequest, setActiveDetailsTab} = props;

  const actions = [
    {
      description: 'close',
      icon: 'fa-close',
      onClick: () => { clearActiveRequest(); }
    }
  ];

  const setTab = (tab) => () => { setActiveDetailsTab(tab); };
  const getTabClasses = (tab) => {
    return `tab ${tab === activeTab ? 'active' : ''}`;
  };
  const createTab = (tab, label) =>
    <li className={getTabClasses(tab)} onClick={setTab(tab)}>{label}</li>;

  let node = null;

  if (request) {
    node = <div className="inspect-request">
      <Toolbar actions={actions} />
      <div className="box-header">
        <div className="title">
          {request.request.hostname}
        </div>
      </div>
      <ul className="box-tabs">
        { createTab(constants.REQUEST_DETAILS_TAB_HEADERS, 'Headers')}
        { createTab(constants.REQUEST_DETAILS_TAB_RESPONSE, 'Response')}
      </ul>
      <RequestDetails request={request} tab={activeTab} />
    </div>;
  }

  return node;
};

InspectRequest.propTypes = {
  request: object,
  clearActiveRequest: func.isRequired
};

import { setActiveRequest, setActiveDetailsTab } from '../../actions/requests.js';
import { getActiveRequest, getActiveDetailsTab } from '../../reducers/requests.js';

const mapStateToProps = (state) => ({
  request: getActiveRequest(state),
  activeTab: getActiveDetailsTab(state)
});

const mapDispatchToProps = (dispatch) => ({
  setActiveDetailsTab: (tab) => dispatch(setActiveDetailsTab(tab)),
  clearActiveRequest: () => dispatch(setActiveRequest(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(InspectRequest);

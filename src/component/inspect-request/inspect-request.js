import React from 'react';
import Toolbar from './toolbar.js';
import RequestDetails from './request-details.js';

const {func, object} = React.PropTypes;

export default class InspectRequest extends React.Component {

  render() {
    const {request, setActiveRequest} = this.props;

    const actions = [
      {
        description: 'close',
        icon: 'fa-close',
        onClick: () => { setActiveRequest(null); }
      }
    ];

    return <div className="inspect-request">
      <Toolbar actions={actions} />
      <div className="box-header">
        <div className="title">
          {request.request.hostname}
        </div>
      </div>
      <RequestDetails request={request} />
    </div>;
  }
}


InspectRequest.propTypes = {
  request: object.isRequired,
  setActiveRequest: func.isRequired
};

import React from 'react';
import Throttle from './footer-throttle';

const {func, object} = React.PropTypes;

export default class Footer extends React.Component {

  render() {
    const {
      toggleCaching,
      isCachingEnabled,
      clearRequests,
      requestData,
      ...other
      } = this.props;

    let cachingButton = <span>
      <i className="fa fa-circle-o"/>
      Caching disabled
    </span>;

    if (isCachingEnabled()) {
      cachingButton = <span>
        <i className="fa fa-circle"/>
        Caching enabled
      </span>;
    }

    return <div className="footer">
      <button onClick={toggleCaching}>{cachingButton}</button>
      <Throttle {...other} />
      <div className="request-count">
        Requests: {requestData.filteredCount}/{requestData.totalCount}
        <button onClick={clearRequests}>
          <i className="fa fa-ban" />
        </button>
      </div>
    </div>;
  }
}

Footer.propTypes = {
  toggleCaching: func.isRequired,
  isCachingEnabled: func.isRequired,
  clearRequests: func.isRequired,
  requestData: object.isRequired
};

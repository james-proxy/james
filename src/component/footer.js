import React from 'react';

const {func, object} = React.PropTypes;

export default class Footer extends React.Component {

  render() {
    const {
      isCachingEnabled,
      toggleCaching,
      requestData
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
      <div className="request-count">
        Requests: {requestData.filteredCount}/{requestData.totalCount}
      </div>
    </div>;
  }
}

Footer.propTypes = {
  toggleCaching: func.isRequired,
  isCachingEnabled: func.isRequired,
  requestData: object.isRequired
};

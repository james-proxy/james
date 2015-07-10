import React from 'react';

const {func} = React.PropTypes;

export default class Footer extends React.Component {

  render() {
    const {isCachingEnabled, toggleCaching} = this.props;

    let cachingButton = <span>
      <i className="fa fa-circle-o"/>
      Caching disabled
    </span>;

    if (isCachingEnabled()) {
      cachingButton = <span>
        <i className="fa fa-circle"/>
        Caching enabled
      </span>
    }

    return <div className="footer">
      <button onClick={toggleCaching}>{cachingButton}</button>
    </div>;
  }
}

Footer.propTypes = {
  toggleCaching: func.isRequired,
  isCachingEnabled: func.isRequired
};

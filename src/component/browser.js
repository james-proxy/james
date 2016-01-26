import React from 'react';

const {string, func} = React.PropTypes;

export default class Browser extends React.Component {

  _openBrowserFactory() {
    const {openBrowser, browserName} = this.props;
    return function() {
      openBrowser(browserName);
    };
  }

  render() {
    const {
      browserName
    } = this.props;
    const src = './images/' + browserName + '_128x128.png';

    return <img className="open-browser" src={src} key={browserName} alt={browserName}
                title={browserName} onClick={this._openBrowserFactory()} />;
  }
}

Browser.propTypes = {
  browserName: string.isRequired,
  openBrowser: func.isRequired
};

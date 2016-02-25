import React from 'react';

const {object, func} = React.PropTypes;

export default class Browser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disableReason: undefined
    };
  }

  _openBrowserFactory() {
    const {openBrowser, browser} = this.props;
    const launchOptions = {
      browser: browser.name,
      version: browser.version
    };

    return () => openBrowser(launchOptions, (disableReason) => {
      this.setState({disableReason});
    });
  }

  _enhanceBrowserName(browser) {
    if (browser.name === 'ie') {
      return 'Internet Explorer';
    } else if (browser.type === 'chrome' && /SxS/.test(browser.command)) {
      return 'Chrome Canary';
    } else if (browser.type === 'firefox' && /Developer Edition/i.test(browser.command)) {
      return 'Firefox Developer Edition';
    }
    return browser.name;
  }

  render() {
    const {browser} = this.props;
    const {disableReason} = this.state;
    const browserName = this._enhanceBrowserName(browser);

    let title = browserName;
    let className = 'browser';

    if (disableReason) {
      className += ' disabled';
      title = disableReason;
    }

    if (!browser.version) {
      className += ' no-version';
    }

    const src = `./images/${browser.type}_128x128.png`;
    return <a className={className} onClick={this._openBrowserFactory()}>
      <img className="browser-icon" src={src} alt={browserName} title={title} />
      <div className="browser-info">
        <div className="browser-name">{browserName}</div>
        <div className="browser-version">{browser.version}</div>
      </div>
    </a>;
  }
}

Browser.propTypes = {
  browser: object.isRequired,
  openBrowser: func.isRequired
};

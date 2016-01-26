import React from 'react';

const {string, func} = React.PropTypes;

export default class Browser extends React.Component {

  constructor(props) {
    super();
    this.state = {
      disableReason: undefined
    };
  }

  _openBrowserFactory() {
    const {openBrowser, browserName} = this.props;
    return () => openBrowser(browserName, (disableReason) => {
      this.setState({disableReason});
    });
  }

  render() {
    const {browserName} = this.props;
    const {disableReason} = this.state;
    let className = "open-browser", title = browserName;

    if (disableReason) {
      className += " disabled";
      title = disableReason;
    }

    const src = './images/' + browserName + '_128x128.png';
    return <img className={className} src={src} alt={browserName}
                title={title} onClick={this._openBrowserFactory()} />;
  }
}

Browser.propTypes = {
  browserName: string.isRequired,
  openBrowser: func.isRequired
};

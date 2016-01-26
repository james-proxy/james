import React from 'react';

const {func, bool, number} = React.PropTypes;

export default class Throttle extends React.Component {

  constructor(props) {
    super();
    this.state = {
      enabled: props.enabled || false,
      rate: props.rate || 0
    };
  }

  toggleThrottle() {
    const enabled = !this.state.enabled;
    this.setState({enabled});

    if (enabled) {
      this.props.onEnableThrottle();
      return;
    }

    this.props.onDisableThrottle();
  }

  updateThrottle(event) {
    const rate = parseInt(event.target.value);
    this.setState({rate});
    this.props.onRateChange(rate);
  }

  render() {
    const icon = this.state.enabled ? 'fa fa-circle' : 'fa fa-circle-o';

    return <div className="throttle">
      <button onClick={this.toggleThrottle.bind(this)}>
        <i className={icon}/>
        Throttle to (kBps):
      </button>
      <input
        onChange={this.updateThrottle.bind(this)}
        type="text"
        defaultValue={this.state.rate}/>
    </div>;
  }
}

Throttle.propTypes = {
  onDisableThrottle: func.isRequired,
  onEnableThrottle: func.isRequired,
  onRateChange: func.isRequired,
  enabled: bool,
  rate: number
};

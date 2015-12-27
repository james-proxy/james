import React from 'react';

const {object} = React.PropTypes;

export default class Throttle extends React.Component {
  render() {
    const {throttle} = this.props;
    const icon = throttle.enabled ? 'fa fa-circle' : 'fa fa-circle-o';

    const updateThrottle = (event) => throttle.kBps = event.target.value;
    const toggleThrottle = function() {
      throttle.enabled = !throttle.enabled;
      render()
    };

    return <div className="throttle">
      <button onClick={toggleThrottle}>
        <i className={icon}/>
        Throttle to (kBps):
      </button>
      <input
        onChange={updateThrottle}
        type='text'
        defaultValue={throttle.kBps}/>
    </div>
  }
}

Throttle.propTypes = {
  throttle: object.isRequired
};

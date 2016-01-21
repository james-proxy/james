import React from 'react';

const {object} = React.PropTypes;

export default class Throttle extends React.Component {
  render() {
    const {throttle, proxy} = this.props;
    const icon = throttle.enabled ? 'fa fa-circle' : 'fa fa-circle-o';

    const updateThrottle = (event) => {
      throttle.kBps = event.target.value;
      proxy.slow({rate: throttle.kBps})
    };
    const toggleThrottle = function() {
      throttle.enabled = !throttle.enabled;
      render();

      if (throttle.enabled) {
        proxy.slow(throttle.kBps);
        return
      }

      proxy.relax();
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
  throttle: object.isRequired,
  proxy: object.isRequired
};

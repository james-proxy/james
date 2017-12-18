import React from 'react';
import PropTypes from 'prop-types';

const Throttle = (props) => {
  const {throttleRate, throttleEnabled, setThrottleRate, toggleThrottle} = props;

  const icon = throttleEnabled ? 'fa fa-circle' : 'fa fa-circle-o';
  const message = throttleEnabled ? 'Throttle to (kBps):' : 'Throttling disabled';

  let input = null;
  if (throttleEnabled) {
    const onChange = (event) => setThrottleRate(parseInt(event.target.value, 10));
    input = <input type="text" defaultValue={throttleRate} onChange={onChange} />;
  }

  return <div className="throttle">
    <button title="Toggle throttling" onClick={toggleThrottle}>
      <i className={icon} />
      <span className="message">{message}</span>
    </button>
    {input}
  </div>;
};

Throttle.propTypes = {
  toggleThrottle: PropTypes.func.isRequired,
  setThrottleRate: PropTypes.func.isRequired,
  throttleEnabled: PropTypes.bool,
  throttleRate: PropTypes.number
};

export default Throttle;

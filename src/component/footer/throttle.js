import React from 'react';

const {func, bool, number} = React.PropTypes;

const Throttle = (props) => {
  const {rate, enabled, onRateChange, toggleThrottle} = props;

  const icon = enabled ? 'fa fa-circle' : 'fa fa-circle-o';
  const message = enabled ? 'Throttle to (kBps):' : 'Throttling disabled';

  let input = null;
  if (enabled) {
    const onChange = (event) => onRateChange(parseInt(event.target.value, 10));
    input = <input type="text" defaultValue={rate} onChange={onChange} />;
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
  toggleThrottle: func.isRequired,
  onRateChange: func.isRequired,
  enabled: bool,
  rate: number
};

export default Throttle;

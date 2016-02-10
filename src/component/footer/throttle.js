import React from 'react';

const {func, bool, number} = React.PropTypes;

const Throttle = (props) => {
  const {rate, enabled, onRateChange, toggleThrottle} = props;

  const icon = enabled ? 'fa fa-circle' : 'fa fa-circle-o';

  return <div className="throttle">
    <button title="Toggle throttling" onClick={toggleThrottle}>
      <i className={icon} />
      Throttle to (kBps):
    </button>
    <input type="text" defaultValue={rate} onChange={onRateChange} />
  </div>;
};

Throttle.propTypes = {
  toggleThrottle: func.isRequired,
  onRateChange: func.isRequired,
  enabled: bool,
  rate: number
};

export default Throttle;

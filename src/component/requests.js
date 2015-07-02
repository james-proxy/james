import React from 'react';
import Request from './request.js';

const {func, string, array, object} = React.PropTypes;

export default class Requests extends React.Component {

  _filter(arr) {
    const filter = this.state.filter;
    if(!filter) {
      return arr;
    }
    return arr.filter((request) => {
      return request.request.fullUrl().indexOf(filter) !== -1;
    });
  }

  render() {

    let {requests, filter} = this.props;
    const {setActiveRequest, config} = this.props;

    requests = requests.map((request) => {
      const handleClick = () => {
        setActiveRequest(request);
      };

      let className = '';
      if(filter && request.request.fullUrl().indexOf(filter) === -1) {
        className = 'hidden';
      }

      return <Request className={className} {...request} config={config} handleClick={handleClick} key={request.request.id}></Request>
    });

    return <div className="requests">
      {requests}
    </div>
  }
}

Requests.propTypes = {
  requests: array.isRequired,
  filter: string,
  setActiveRequest: func.isRequired,
  config: object.isRequired
};


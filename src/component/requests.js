import React from 'react';
import Request from './request.js';

const {func, object} = React.PropTypes;

const requestElementHeight = 34;

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

  componentDidMount() {
    const requests = document.querySelector('.requests');
    const requestsInner = document.querySelector('.requests-inner');
    requests.addEventListener('scroll', () => {
      const fromIndex = Math.ceil(requests.scrollTop / requestElementHeight) - 5;
      this._setFromIndex(fromIndex < 0 ? 0 : fromIndex);
    });
  }

  componentDidUpdate() {

  }

  _setFromIndex(fromindex) {
    const {setFromIndex} = this.props;
    setFromIndex(fromindex);
  }

  render() {

    let {requests, filter} = this.props;
    const {setActiveRequest, config, amountOfRequests, fromIndex} = this.props;

    requests = requests.map((request, index) => {
      const handleClick = () => {
        setActiveRequest(request);
      };

      let className = '';
      if(filter && request.request.fullUrl().indexOf(filter) === -1) {
        className = 'hidden';
      }



      const positionTop = (amountOfRequests - request.requestNumber) * requestElementHeight;

      console.log(amountOfRequests, request.requestNumber, requestElementHeight);

      return <Request className={className} {...request} positionTop={positionTop} config={config} handleClick={handleClick} key={request.request.id}></Request>
    });

    const style = {
      height: amountOfRequests * requestElementHeight,
      position: 'absolute',
      left: 0,
      right: 0
    };

    return <div className="requests">
      <div className="requests-inner" style={style}>
        {requests}
      </div>
    </div>
  }
}

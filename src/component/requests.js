import React from 'react';
import Request from './request.js';

const {func, string, array, object} = React.PropTypes;

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
      const fromIndex = Math.ceil(requests.scrollTop / requestElementHeight) - 15;
      this._setFromIndex(fromIndex < 0 ? 0 : fromIndex);
    });
  }

  _setFromIndex(fromindex) {
    this.props.setFromIndex(fromindex);
  }

  render() {

    const {setActiveRequest, config, requestData} = this.props;
    const amountOfRequests = requestData.totalCount;
    const requests = requestData.requests.map((request, index) => {
      const handleClick = () => {
        setActiveRequest(request);
      };

      const positionTop = request.requestNumber * requestElementHeight;
      return <Request
        {...request}
        positionTop={positionTop}
        config={config}
        handleClick={handleClick}
        key={request.request.id}
      ></Request>
    });

    const style = {
      height: amountOfRequests * requestElementHeight
    };

    return <div className="requests">
      <div className="requests-inner" style={style}>
        {requests}
      </div>
    </div>
  }
}

Requests.propTypes = {
  requests: array.isRequired,
  filter: string,
  setActiveRequest: func.isRequired,
  config: object.isRequired
};


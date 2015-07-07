import React from 'react';
import Request from './request.js';

const {func, string, object} = React.PropTypes;

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
    const requests = React.findDOMNode(this);
    const requestsInner = requests.firstChild;
    requests.addEventListener('scroll', () => {
      const fromIndex = Math.ceil(requests.scrollTop / requestElementHeight) - 15;
      this._setFromIndex(fromIndex < 0 ? 0 : fromIndex);
    });
  }

  componentDidUpdate() {
    const previousFilter = this.filter;
    this.filter = this.props.requestData.filter;
    const requests = React.findDOMNode(this);

    if(previousFilter !== this.filter) {
      requests.scrollTop = 0;
    }
  }

  _setFromIndex(fromindex) {
    this.props.setFromIndex(fromindex);
  }

  render() {

    const {setActiveRequest, config, requestData} = this.props;
    let amountOfRequests;

    if(requestData.filter) {
      amountOfRequests = requestData.requests.length;
    } else {
      amountOfRequests = requestData.totalCount;
    }


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
  requestData: object.isRequired,
  filter: string,
  setActiveRequest: func.isRequired,
  config: object.isRequired
};


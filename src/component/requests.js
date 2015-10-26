import React from 'react';
import Request from './request.js';

const {func, string, object} = React.PropTypes;

const requestElementHeight = 34;

export default class Requests extends React.Component {

  _filter(arr) {
    const filter = this.state.filter;
    if (!filter) {
      return arr;
    }
    return arr.filter((request) => {
      return request.request.fullUrl().indexOf(filter) !== -1;
    });
  }

  _onScroll() {
    const scrollableDomNode = React.findDOMNode(this);
    const fromIndex = Math.ceil(scrollableDomNode.scrollTop / requestElementHeight) - 15;
    this.props.setFromIndex((fromIndex < 0) ? 0 : fromIndex);
  }

  componentDidMount() {
    const scrollableDomNode = React.findDOMNode(this);
    scrollableDomNode.addEventListener('scroll', this._onScroll.bind(this));
  }

  componentWillUnmount() {
    const scrollableDomNode = React.findDOMNode(this);
    scrollableDomNode.removeEventListener('scroll', this._onScroll);
  }

  componentDidUpdate() {
    const previousFilter = this.filter;
    this.filter = this.props.requestData.filter;
    const requests = React.findDOMNode(this);

    if (previousFilter !== this.filter) {
      requests.scrollTop = 0;
    }
  }

  render() {
    const {setActiveRequest, showWindow, config, requestData} = this.props;
    const amountOfRequests = requestData.filteredCount;

    const requestNodes = requestData.requests.map((request) => {
      const handleClick = () => {
        setActiveRequest(request);
      };

      const positionTop = request.requestNumber * requestElementHeight;
      return <Request
        {...request}
        positionTop={positionTop}
        config={config}
        showWindow={showWindow}
        handleClick={handleClick}
        key={request.request.id} />;
    });

    const style = {
      height: amountOfRequests * requestElementHeight
    };

    return <div className="requests">
      <div className="requests-inner" style={style}>
        {requestNodes}
      </div>
    </div>;
  }
}

Requests.propTypes = {
  requestData: object.isRequired,
  showWindow: func.isRequired,
  filter: string,
  setActiveRequest: func.isRequired,
  setFromIndex: func.isRequired,
  config: object.isRequired
};


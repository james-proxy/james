import React from 'react';
import ReactDOM from 'react-dom';
import Request from './request.js';

const {func, string, object} = React.PropTypes;

const requestElementHeight = 33;

export default class Requests extends React.Component {
  _onScroll() {
    const scrollableDomNode = ReactDOM.findDOMNode(this);
    const fromIndex = Math.ceil(scrollableDomNode.scrollTop / requestElementHeight) - 15;
    this.props.setFromIndex(fromIndex < 0 ? 0 : fromIndex);
  }

  componentDidMount() {
    const scrollableDomNode = ReactDOM.findDOMNode(this);
    scrollableDomNode.addEventListener('scroll', this._onScroll.bind(this));
  }

  componentWillUnmount() {
    const scrollableDomNode = ReactDOM.findDOMNode(this);
    scrollableDomNode.removeEventListener('scroll', this._onScroll);
  }

  componentDidUpdate() {
    const previousFilter = this.filter;
    this.filter = this.props.requestData.filter;
    const requests = ReactDOM.findDOMNode(this);

    if (previousFilter !== this.filter) {
      requests.scrollTop = 0;
    }
  }

  render() {
    const {
      isActiveRequest,
      setActiveRequest,
      isContextMenuRequest,
      setContextMenuRequest,
      showWindow,
      config,
      requestData,
      removeUrlMapping,
      toggleUrlMappingActiveState
    } = this.props;

    const requestNodes = requestData.requests.map((request) => {
      const isActive = isActiveRequest(request);
      const isContextMenu = isContextMenuRequest(request);

      const handleClick = () => {
        setContextMenuRequest(null);
        setActiveRequest(request);
      };

      const handleContextMenu = () => {
        setContextMenuRequest(request);
      };

      return <Request
        {...request}
        isActive={isActive}
        isContextMenu={isContextMenu}
        config={config}
        showWindow={showWindow}
        handleClick={handleClick}
        handleContextMenu={handleContextMenu}
        key={request.request.id}
        removeUrlMapping={removeUrlMapping}
        toggleUrlMappingActiveState={toggleUrlMappingActiveState} />;
    });

    return <div className="requests">
      <div className="requests-inner">
        {requestNodes}
      </div>
    </div>;
  }
}

Requests.propTypes = {
  requestData: object.isRequired,
  showWindow: func.isRequired,
  filter: string,
  isActiveRequest: func.isRequired,
  setActiveRequest: func.isRequired,
  isContextMenuRequest: func.isRequired,
  setContextMenuRequest: func.isRequired,
  setFromIndex: func.isRequired,
  config: object.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

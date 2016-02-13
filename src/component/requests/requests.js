import React from 'react';
import ReactDOM from 'react-dom';
import Request from './request.js';

const {func, string, object} = React.PropTypes;

const requestHeight = 34;

export default class Requests extends React.Component {
  constructor() {
    super();
    this.fromIndex = 0;
    this.requestCount = 0;
    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  _onScroll() {
    const scrollableDomNode = ReactDOM.findDOMNode(this);

    //Subtracting 1 so that, when scrolling, still have partial element at the top
    this.fromIndex = Math.ceil(scrollableDomNode.scrollTop / requestHeight) - 1;
    this.fromIndex = this.fromIndex < 0 ? 0 : this.fromIndex;
    this.props.setFromIndex(this.fromIndex);
  }

  _onResize() {
    const height = ReactDOM.findDOMNode(this).clientHeight;
    this.requestCount = Math.ceil(height / requestHeight) + 1; // +1 if partial requests elements at top and bottom
    this.props.setVisibleCount(this.requestCount);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('scroll', this._onScroll);
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
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

    const culledBefore = this.fromIndex;
    const culledAfter = requestData.totalCount - culledBefore - this.requestCount;

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
      <div style={{height: culledBefore * requestHeight}}></div>
      {requestNodes}
      <div style={{height: culledAfter * requestHeight}}></div>
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
  setVisibleCount: func.isRequired,
  config: object.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

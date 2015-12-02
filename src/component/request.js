import React from 'react';
import FullUrl from './full-url.js';
import ContextMenu from './context-menu.js';

const {func, object, number} = React.PropTypes;

export default class Request extends React.Component {
  constructor() {
    super();

    this.state = {
      isContextMenuActive: false
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.request.id !== nextProps.request.id ||
      this.props.positionTop !== nextProps.positionTop ||
      this.done !== nextProps.request.done;
  }

  _getLabels(request) {
    const {labels} = this.props.config;
    const url = request.fullUrl();
    const labelElements = [];

    if (request.isMappedUrl) {
      const activeClass = request.isMappingActive ? 'mapped' : 'mapped-inactive';

      labelElements.push(
        <span className={'label ' + activeClass} key="mapped">
          <i className="fa fa-warning"></i>
          mapped
        </span>
      );
    }

    labels.forEach(function(label, index) {
      if (label.regex.test(url)) {
        const classes = ['label'];
        classes.push(label.className);
        labelElements.push(
          <span className={classes.join(' ')} key={index}>
            {label.name}
          </span>
        );
      }
    });

    return labelElements;
  }

  _setContextMenuState(newState) {
    this.setState({isContextMenuActive: newState});
    this.forceUpdate();
  }

  _toggleContextMenu() {
    this._setContextMenuState(!this.state.isContextMenuActive);
  }

  _onClick() {
    this._setContextMenuState(false);
    this.props.handleClick();
  }

  render() {
    const {request, response, showWindow, positionTop, removeUrlMapping, toggleUrlMappingActiveState} = this.props;

    this.done = request.done;

    let took = <i className="fa fa-gear fa-spin"></i>;
    if (request.took) {
      took = request.took + 'ms';
    }

    const style = {
      top: positionTop
    };

    const contextMenuItems = [{
      title: 'Add mapping',
      icon: 'fa-plus',
      onClick: (event) => {
        event.preventDefault();
        showWindow('UrlMapping', {urlInput: request.originalUrl});
        this._toggleContextMenu();
      }
    }];

    if (request.isMappedUrl) {
      contextMenuItems.push({
        title: 'Remove mapping',
        icon: 'fa-trash-o',
        onClick: (event) => {
          event.preventDefault();
          removeUrlMapping(request.originalUrl);
          this._toggleContextMenu();
        }
      }, {
        title: 'Activate/Deactivate',
        icon: 'fa-toggle-on',
        onClick: (event) => {
          event.preventDefault();
          toggleUrlMappingActiveState(request.originalUrl);
          this._toggleContextMenu();
        }
      });
    }

    return <div className="request" style={style}>
      { this.state.isContextMenuActive &&
        <ContextMenu items={contextMenuItems}/>
      }
      <div className="request-inner" onClick={this._onClick.bind(this)} onContextMenu={this._toggleContextMenu.bind(this)}>
        <span className="method property">{request.method}</span>
          <span className="time property">
            {took}
          </span>
          <span className="status-code property">
            {response.statusCode}
          </span>
        <FullUrl request={request} />

        <div className="labels">
          {this._getLabels(request)}
        </div>
      </div>
    </div>;
  }
}

Request.propTypes = {
  config: object.isRequired,
  request: object.isRequired,
  response: object.isRequired,
  handleClick: func.isRequired,
  showWindow: func.isRequired,
  positionTop: number.isRequired,
  removeUrlMapping: func.isRequired,
  toggleUrlMappingActiveState: func.isRequired
};

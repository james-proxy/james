import React from 'react';
import FullUrl from './full-url.js';

const {func, object} = React.PropTypes;

export default class Requests extends React.Component {

  _getLabels(request) {

    const {labels} = this.props.config;
    const url = request.fullUrl();

    let labelElements = [];

    if(request.mapped) {
      labelElements.push(
        <span className="label mapped" key="mapped">
          <i className="fa fa-warning"></i>
          mapped
        </span>
      );
    }

    labels.forEach(function(label, index) {
      if(label.regex.test(url)) {
        let classes = ['label'];
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

  render() {

    let {requests} = this.props;
    const {setActiveRequest} = this.props;

    requests = requests.map((request, index) => {

      const handleClick = () => {
        setActiveRequest(request);
      };

      return <div className="request" key={index} onClick={handleClick}>
        <span className="method">{request.request.method}</span>
        <FullUrl request={request.request} shorten={true}></FullUrl>
        <div className="labels">
          {this._getLabels(request.request)}
        </div>
      </div>
    });

    return <div className="requests">
      {requests}
    </div>
  }
}

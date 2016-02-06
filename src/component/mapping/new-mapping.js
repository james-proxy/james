import React from 'react';
import remote from 'remote';

import createChooseFile from '../../service/choose-file.js';

const {func, string} = React.PropTypes;

const Step = {
  target: 0,
  destination: 1
};

const initialState = {
  step: Step.target,
  target: null,
  destination: null,
  isLocal: null
};

export default class NewMapping extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;

    // prefill from external source (e.g., request context menu)
    if (props.target) {
      this.state.target = props.target;
    }
  }

  handleTarget(event) {
    this.setState({target: event.target.value});
  }

  createUrl() {
    this.setState({step: Step.destination, isLocal: false});
  }

  createFile() {
    this.setState({step: Step.destination, isLocal: true});
  }

  handleDestination(event) {
    this.setState({destination: event.target.value});
  }

  selectFile() {
    const chooseFile = createChooseFile(remote.getCurrentWindow());

    chooseFile((paths) => {
      if (!paths) return;
      const path = paths[0];

      this.setState({destination: path});
    });
  }

  finish() {
    const {saveMapping} = this.props;
    const {target, destination, isLocal} = this.state;

    saveMapping(target, destination, isLocal);
    this.reset();
  }

  reset() {
    this.setState(initialState);
  }

  render() {
    let form;

    if (this.state.step === Step.target) {
      form = <div className="mapping-target">
        <h1>Create new URL Mapping</h1>
        <div className="description">URL mappings allow James to intercept a request and respond with a URL or file of your choice.</div>
        <input type="text"
                placeholder="Enter target URL to map"
                value={this.state.target}
                onChange={this.handleTarget.bind(this)} />
        <a className="btn waves-effect waves-light"
            onClick={this.createUrl.bind(this)}>URL to URL</a>
        <a className="btn waves-effect waves-light"
            onClick={this.createFile.bind(this)}>URL to File</a>
      </div>;
    } else if (this.state.step === Step.destination) {
      let input;
      if (this.state.isLocal) {
        input = <input
                  type="text"
                  disabled
                  placeholder="Choose file"
                  value={this.state.destination}
                  onClick={this.selectFile.bind(this)}
                  onChange={this.handleDestination.bind(this)}
                />;
      } else {
        input = <input
                  type="text"
                  placeholder="http(s)://"
                  value={this.state.destination}
                  onChange={this.handleDestination.bind(this)}
                />;
      }

      form = <div className="mapping-destination">
        <h1>Enter destination</h1>
        <div className="description">James will respond with this URL or file instead.</div>
        {input}
        <a className="btn waves-effect waves-light"
            onClick={this.finish.bind(this)}>Create</a>
        <a className="btn-flat waves-effect waves-light"
            onClick={this.reset.bind(this)}>Cancel</a>
      </div>;
    }

    return <div className="new-mapping">{form}</div>;
  }
}

NewMapping.propTypes = {
  saveMapping: func.isRequired,
  target: string
};

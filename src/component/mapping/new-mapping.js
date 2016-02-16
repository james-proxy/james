import React from 'react';

import NewMappingTarget from './new-mapping-target.js';
import NewMappingDestination from './new-mapping-destination.js';

const {func, string} = React.PropTypes;

const Step = Object.freeze({
  target: 0,
  destination: 1
});

const initialState = Object.freeze({
  step: Step.target,
  target: undefined,
  destination: undefined,
  isLocal: undefined,
  valid: undefined
});

export default class NewMapping extends React.Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState);

    // prefill from external source (e.g., request context menu)
    if (props.target) {
      this.state.target = props.target;
    }

    this.validate = this.validate.bind(this);
    this.updateTarget = this.updateTarget.bind(this);
    this.updateDestination = this.updateDestination.bind(this);
    this.createUrl = this.createUrl.bind(this);
    this.createFile = this.createFile.bind(this);
    this.finish = this.finish.bind(this);
    this.reset = this.reset.bind(this);
  }

  validate() {
    let valid = true;
    if (this.state.step === Step.target) {
      valid = !!this.state.target;
    } else if (this.state.step === Step.destination) {
      valid = !!this.state.destination;
    }
    this.setState({valid: valid});
    return valid;
  }

  updateTarget(value) {
    this.setState({target: value});
  }

  updateDestination(value) {
    this.setState({destination: value});
  }

  createUrl() {
    if (!this.validate()) { return; }
    this.setState({step: Step.destination, isLocal: false, valid: null});
  }

  createFile() {
    if (!this.validate()) { return; }
    this.setState({step: Step.destination, isLocal: true, valid: null});
  }

  finish() {
    if (!this.validate()) { return; }
    const {saveMapping} = this.props;
    const {target, destination, isLocal} = this.state;

    saveMapping(target, destination, isLocal);
    this.reset();
  }

  reset() {
    this.setState(Object.assign({}, initialState));
  }

  render() {
    let form;
    let submit;
    const {step, target, destination, isLocal} = this.state;

    if (step === Step.target) {
      submit = this.createUrl;
      form = <NewMappingTarget
                target={target}
                update={this.updateTarget}
                createUrl={this.createUrl}
                createFile={this.createFile}
              />;
    } else if (step === Step.destination) {
      submit = this.finish;
      form = <NewMappingDestination
                isLocal={isLocal}
                destination={destination}
                update={this.updateDestination}
                create={this.finish}
                cancel={this.reset}
              />;
    }

    return <form className="new-mapping" onSubmit={submit}>{form}</form>;
  }
}

NewMapping.propTypes = {
  saveMapping: func.isRequired,
  target: string
};

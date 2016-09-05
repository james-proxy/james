import React, { Component } from 'react';
import { connect } from 'react-redux';

import constants from '../../constants.js';
import NewMappingTarget from './new-mapping-target.js';
import NewMappingDestination from './new-mapping-destination.js';

const {func, object} = React.PropTypes;

class NewMapping extends Component {

  constructor(props) {
    super(props);

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
    const { step, target, destination } = this.props.mapping;

    if (step === constants.NEW_MAPPING_STEP_TARGET) {
      valid = !!target;
    } else if (step === constants.NEW_MAPPING_STEP_DESTINATION) {
      valid = !!destination;
    }
    // this.setState({valid: valid});
    return valid;
  }

  updateTarget(value) {
    this.props.update({target: value});
  }

  updateDestination(value) {
    this.props.update({destination: value});
  }

  createUrl() {
    if (!this.validate()) { return; }
    this.props.next(false);
  }

  createFile() {
    if (!this.validate()) { return; }
    this.props.next(true);
  }

  finish() {
    if (!this.validate()) { return; }
    const {saveMapping} = this.props;
    const {target, destination, isLocal} = this.props.mapping;

    saveMapping(target, destination, isLocal);
    this.reset();
  }

  reset() {
    this.props.reset();
  }

  render() {
    let form;
    let submit = () => {};
    const {step, target, destination, isLocal} = this.props.mapping;

    if (step === constants.NEW_MAPPING_STEP_TARGET) {
      submit = this.createUrl;
      form = <NewMappingTarget
                target={target}
                update={this.updateTarget}
                createUrl={this.createUrl}
                createFile={this.createFile}
              />;
    } else if (step === constants.NEW_MAPPING_STEP_DESTINATION) {
      submit = this.finish;
      form = <NewMappingDestination
                isLocal={isLocal}
                destination={destination}
                update={this.updateDestination}
                create={this.finish}
                cancel={this.reset}
              />;
    }

    const onSubmit = (event) => {
      submit();
      event.preventDefault();
    };

    return <form className="new-mapping" onSubmit={onSubmit}>{form}</form>;
  }
}

NewMapping.propTypes = {
  saveMapping: func.isRequired,
  update: func.isRequired,
  next: func.isRequired,
  reset: func.isRequired,
  mapping: object
};

import { updateNewMapping, nextNewMapping, resetNewMapping } from '../../actions/url-mappings.js';
import { getNewMapping } from '../../reducers/url-mappings.js';

const mapStateToProps = (state) => ({
  mapping: getNewMapping(state)
});

const mapDispatchToProps = {
  update: updateNewMapping,
  next: nextNewMapping,
  reset: resetNewMapping
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMapping);

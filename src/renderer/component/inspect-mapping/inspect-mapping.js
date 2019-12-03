import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from '../inspect-request/toolbar';
import MappingDetails from './mapping-details';

const InspectMapping = (props) => {
  const {
    mapping,
    clearSelectedMapping,
    onEdit
  } = props;

  const actions = [
    {
      description: 'close',
      icon: 'fa-close',
      onClick: () => { clearSelectedMapping(); }
    }
  ];

  if (mapping) {
    return <div className="inspect-request">
      <Toolbar actions={actions} />
      <div className="box-header">
        <div className="title">
          {mapping.url}
        </div>
      </div>
      <MappingDetails
        onEdit={(newResponse) => onEdit(mapping.url, newResponse)}
        src={mapping.responseToMerge}
      />
    </div>;
  }

  return null;
};

InspectMapping.propTypes = {
  mapping: PropTypes.object,
  clearSelectedMapping: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

import { setSelectedMapping, setResponseToMerge } from '../../../common/actions/url-mappings';
import { getSelectedMapping } from '../../reducers/url-mappings';

const mapStateToProps = (state) => ({
  mapping: getSelectedMapping(state)
});

const mapDispatchToProps = (dispatch) => ({
  onEdit: (url, newValue) => dispatch(setResponseToMerge(url, newValue)),
  clearSelectedMapping: () => dispatch(setSelectedMapping(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(InspectMapping);

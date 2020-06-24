import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, clone } from 'lodash';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import View from '../components/views/ComparisonForm';

class ComparisonCreateRoute extends React.Component {
  static manifest = Object.freeze({
    entitlements: {
      limitParam: 'perPage',
      params: {
        stats: 'true',
      },
      path: 'erm/resource/%{entitlementQueryParams.path}',
      perRequest: 100,
      records: 'results',
      recordsRequired: '%{entitlementQueryParams.entitlementsCount}',
      type: 'okapi',
    },
    entitlementQueryParams: {
      initialValue: { entitlementsCount: 100 }
    }
  });

  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  };

  static contextType = CalloutContext;

  static defaultProps = {
    handlers: {},
  }

  constructor(props) {
    super(props);
    this.handleEResourceAdded = this.handleEResourceAdded.bind(this);
    this.handleEResourceRemoved = this.handleEResourceRemoved.bind(this);
    // We will store an object with keys being the eresource ids, and the values being the entitlements for that eresource
    this.state = {
      entitlementsWithIds: {},
      eResourceId: '' // eslint-disable-line react/no-unused-state
    };
  }


  static getDerivedStateFromProps(props, state) {
    const { entitlementsWithIds, eResourceId } = state;
    const { entitlements } = props.resources;

    // When we switch to a new resource, we need to check that the records actually correspond to the new resource
    const correctQuery = entitlements?.url?.includes(eResourceId) || false;

    if (eResourceId !== '') {
      // When we actually get the loaded entitlements, we want to add them to the state object, and clear the eResourceId from state
      if (correctQuery && entitlements?.records?.[0] && !entitlementsWithIds[eResourceId]) {
        // If that eresource isn't already accounted for in the entitlementsWithIds object, add it.
        const newState = cloneDeep(entitlementsWithIds);
        newState[eResourceId] = entitlements?.records;
        return { entitlementsWithIds: newState, eResourceId: '' };
      }
    }
    return null;
  }

  // These two methods handle the updating of the entitlements query when an eresource is added to the comparison form.
  componentDidUpdate() {
    const { mutator, resources } = this.props;
    const totalEntitlements = resources?.entitlements.records.totalRecords;
    const { entitlementsCount } = resources.entitlementQueryParams;

    if (totalEntitlements > entitlementsCount) {
      mutator.entitlementQueryParams.update({ entitlementsCount: totalEntitlements });
    }
  }

  // This method forces the entitlements query to use the passed eresource id
  handleEResourceAdded(eResourceId) {
    this.props.mutator.entitlementQueryParams.update({
      path: `${eResourceId}/entitlements`
    });
    this.setState({ eResourceId });
  }

  // When removing an eresource from the comparison form,
  // we want it to be removed from the saved list of entitlements with ids as well
  handleEResourceRemoved(eResourceId) {
    const { entitlementsWithIds } = this.state;
    const newState = cloneDeep(entitlementsWithIds);
    delete newState[eResourceId];

    this.setState({ entitlementsWithIds: newState, eResourceId: '' });
  }

  returnIdAndOnDate(valuesArray) {
    const newValues = [];
    valuesArray.forEach(obj => {
      newValues.push({ id: obj.id, onDate: obj.onDate });
    });
    return newValues;
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`/erm-comparisons${location.search}`);
  }

  handleSubmit = (comparison) => {
    const submitValues = cloneDeep(comparison);

    if (submitValues.agreements) {
      submitValues.agreements = this.returnIdAndOnDate(submitValues.agreements);
    }
    if (submitValues.packages) {
      submitValues.packages = this.returnIdAndOnDate(submitValues.packages);
    }

    console.log("Submitted: %o", submitValues);
    window.alert('This will eventually submit a new comparison');
  }

  render() {
    const entitlements = this.state.entitlementsWithIds || {};
    const { handlers } = this.props;
    return (
      <View
        data={{
          entitlements
        }}
        handlers={{
          ...handlers,
          onClose: this.handleClose,
          onEResourceAdded: this.handleEResourceAdded,
          onEResourceRemoved: this.handleEResourceRemoved
        }}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(ComparisonCreateRoute);

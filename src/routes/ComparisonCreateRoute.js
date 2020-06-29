import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import View from '../components/views/ComparisonForm';

class ComparisonCreateRoute extends React.Component {
  static manifest = Object.freeze({
    entitlements: {
      limitParam: 'perPage',
      params: {
        stats: 'true',
      },
      path: 'erm/resource/%{entitlementQueryParams.id}/entitlements',
      perRequest: 100,
      records: 'results',
      recordsRequired: '%{entitlementQueryParams.entitlementsCount}',
      type: 'okapi',
    },
    entitlementQueryParams: {
      initialValue: { entitlementsCount: 100 }
    },
    comparisons: {
      clientGeneratePk: false,
      fetch: false,
      path: 'erm/jobs/comparison',
      shouldRefresh: () => false,
      type: 'okapi',
    },
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

    /*
      We save in state an object with keys of the ids of eResources, and the values of their entitlement information,
      gleaned from a secondary API call made asyncronously. We also save the relevant eResourceId into state, so that we
      can access that from getDerivedStateFromProps, which is where we check the incoming entitlement information against
      the id.
    */
    this.state = {
      entitlementsWithIds: {},
      eResourceId: '' // eslint-disable-line react/no-unused-state
    };
  }


  static getDerivedStateFromProps(props, state) {
    const { entitlementsWithIds, eResourceId } = state;
    const { entitlements } = props.resources;

    /*
      Stripes appears to have an issue, whereby when a query URL is changed, it does not unload the current set of results.
      Instead the current set of results remain loaded, along with a "loading" status of False, until the new results come through.
      Hence the only way to currently check whether the correct set of results exists in the resources prop is to compare the url
      of the query against the saved eResourceId.
    */
    const correctQuery = entitlements?.url?.includes(eResourceId) || false;

    // If we don't have an eResourceId saved in state then we can skip this logic.
    // When we actually get the loaded entitlements, we want to add them to the state object, and clear the eResourceId from state.
    if (eResourceId !== '' && correctQuery && entitlements?.records?.[0] && !entitlementsWithIds[eResourceId]) {
      // If that eresource isn't already accounted for in the entitlementsWithIds object, add it.
      const newState = cloneDeep(entitlementsWithIds);
      newState[eResourceId] = entitlements?.records;
      return { entitlementsWithIds: newState, eResourceId: '' };
    }
    return null;
  }

  // This method ensures we're only ever making a call for the necessary number of entitlements on an eresource.
  componentDidUpdate() {
    const { mutator, resources } = this.props;
    const totalEntitlements = resources?.entitlements.records.totalRecords;
    const { entitlementsCount } = resources.entitlementQueryParams;

    if (totalEntitlements > entitlementsCount) {
      mutator.entitlementQueryParams.update({ entitlementsCount: totalEntitlements });
    }
  }

  /*
    This callback changes a query parameter to allow a secondary API call to be made, and the entitlements information for this
    eResource to be displayed. Due to the way this works asyncronously within stripes, we have to do a bunch of validation to ensure
    we actually have the correct information for the correct eResource. Since this is unavoidable, and we don't actually want to submit
    this information along with the form, we store the entitlements information in state manually rather than plugging it into form state.
    Thus when we go to retrieve the entitlement information, we access the 'entitlementsWithIds' object, which has Keys of the eResource
    ids, and Values of the entitlement information for that eResource.
   */
  handleEResourceAdded(eResourceId) {
    this.props.mutator.entitlementQueryParams.update({
      id: eResourceId
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

  returnIdAndOnDate(valuesArray = []) {
    const newValues = [];
    valuesArray.forEach(obj => {
      newValues.push({ titleList: obj.id, date: obj.onDate });
    });
    return newValues;
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`/erm-comparisons${location.search}`);
  }

  handleSubmit = (comparison) => {
    const { history, location, mutator } = this.props;
    const submitValues = { name: comparison.name };
    submitValues.comparisonPoints = this.returnIdAndOnDate(comparison.agreements);
    submitValues.comparisonPoints = submitValues.comparisonPoints.concat(this.returnIdAndOnDate(comparison.packages));
    return mutator.comparisons
      .POST(submitValues)
      .then(response => {
        const comparisonId = response?.id ?? '';
        const name = response?.name ?? '';

        history.push(`/erm-comparisons/${comparisonId}${location.search}`);
        this.context.sendCallout({ message: <SafeHTMLMessage id="erm-comparison.comparison.created.success" values={{ name }} /> });
      });
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

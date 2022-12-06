import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import PropTypes from 'prop-types';
import { cloneDeep, isEqual } from 'lodash';

import { FormattedMessage } from 'react-intl';
import { useCallout, useOkapiKy } from '@folio/stripes/core';
import { useBatchedFetch } from '@folio/stripes-erm-components';

import { RESOURCE_ENTITLEMENTS_ENDPOINT } from '../../constants/endpoints';

import View from '../../components/views/ComparisonForm';

const ComparisonCreateRoute = ({
  handlers = {},
  history,
  location,
}) => {
  const callout = useCallout();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  /*
    We save in state an object with keys of the ids of eResources, and the values of their entitlement information,
    gleaned from a secondary API call made asyncronously.
  */
  const [entitlementsWithIds, setEntitlementsWithIds] = useState({});

  /* With state and react-query we track first/second Eresource as they're added,
   * then batch fetch all their entitlements
   * and store them against the correct id in state
   */
  const [firstEResourceId, setFirstEresourceId] = useState();
  const [secondEResourceId, setSecondEresourceId] = useState();

  // MUTATION FOR POSTing ComparisonJob
  const { mutateAsync: postComparison } = useMutation(
    ['ERM', 'Comparisons', 'POST', 'erm/jobs/comparison'],
    (payload) => ky.post('erm/jobs/comparison', { json: { ...payload } }).json()
  );

  // BATCHED FETCH 1
  const {
    results: firstEresourceEntitlements,
    total: firstEresourceEntitlementCount,
    isLoading: areFirstEresourceEntitlementsLoading
  } = useBatchedFetch({
    nsArray: ['ERM', 'Eresource', firstEResourceId, 'Entitlements', RESOURCE_ENTITLEMENTS_ENDPOINT(firstEResourceId)],
    path: RESOURCE_ENTITLEMENTS_ENDPOINT(firstEResourceId),
    queryParams: {
      enabled: !!firstEResourceId
    }
  });

  // BATCHED FETCH 2
  const {
    results: secondEresourceEntitlements,
    total: secondEresourceEntitlementCount,
    isLoading: areSecondEresourceEntitlementsLoading
  } = useBatchedFetch({
    nsArray: ['ERM', 'Eresource', secondEResourceId, 'Entitlements', RESOURCE_ENTITLEMENTS_ENDPOINT(secondEResourceId)],
    path: RESOURCE_ENTITLEMENTS_ENDPOINT(secondEResourceId),
    queryParams: {
      enabled: !!secondEResourceId
    }
  });

  useEffect(() => {
    // If we have fetched all first resource entitlements, add them to the state
    if (
      firstEResourceId &&
      !areFirstEresourceEntitlementsLoading &&
      firstEresourceEntitlements?.length === firstEresourceEntitlementCount &&
      !isEqual(entitlementsWithIds[firstEResourceId], firstEresourceEntitlements)) {
      setEntitlementsWithIds({
        ...entitlementsWithIds,
        [firstEResourceId]: firstEresourceEntitlements
      });
    }

    // If we have fetched all second resource entitlements, add them to the state
    if (
      secondEResourceId &&
      !areSecondEresourceEntitlementsLoading &&
      secondEresourceEntitlements?.length === secondEresourceEntitlementCount &&
      !isEqual(entitlementsWithIds[secondEResourceId], secondEresourceEntitlements)) {
      setEntitlementsWithIds({
        ...entitlementsWithIds,
        [secondEResourceId]: secondEresourceEntitlements
      });
    }
  }, [
    areFirstEresourceEntitlementsLoading,
    firstEresourceEntitlements,
    firstEresourceEntitlementCount,
    entitlementsWithIds,
    firstEResourceId,
    areSecondEresourceEntitlementsLoading,
    secondEresourceEntitlements,
    secondEresourceEntitlementCount,
    secondEResourceId
  ]);

  const getComparisonPointsData = ({ agreements = [], packages = [] }) => {
    return [
      ...agreements
        .map(agreement => ({
          titleList: agreement.comparisonPoint?.id,
          date: agreement.onDate
        })),
      ...packages
        .map(pkg => ({
          titleList: pkg.comparisonPoint?.id,
          date: pkg.onDate
        }))
    ];
  };

  // Store the new eresource either in firstEresourceId or secondEresourceId
  const handleEResourceAdded = (eResourceId, cardinality) => {
    if (cardinality === 'FIRST' && firstEResourceId !== eResourceId) {
      setFirstEresourceId(eResourceId);
    } else if (cardinality === 'SECOND' && secondEResourceId !== eResourceId) {
      setSecondEresourceId(eResourceId);
    }
  };

  // When removing an eresource from the comparison form,
  // we want it to be removed from the saved list of entitlements with ids as well
  const handleEResourceRemoved = (eResourceId, cardinality) => {
    const newState = cloneDeep(entitlementsWithIds);
    delete newState[eResourceId];
    setEntitlementsWithIds(newState);
    if (cardinality === 'FIRST') {
      setFirstEresourceId();
    } else if (cardinality === 'SECOND') {
      setSecondEresourceId();
    }
  };

  const handleClose = () => {
    history.push(`/comparisons-erm${location.search}`);
  };

  const sendCallout = (operation, outcome, specificError = undefined, errorMessage = '', values = {}) => {
    let messageId = `ui-erm-comparisons.comparison.${operation}.${outcome}`;
    if (specificError) {
      messageId = `${messageId}.${specificError}`;
    }
    callout.sendCallout({
      type: outcome,
      message: <FormattedMessage id={messageId} values={{ err: errorMessage, ...values }} />,
      timeout: (errorMessage || specificError) ? 0 : undefined, // Don't autohide callouts with a specified error message.
    });
  };

  const handleSubmit = (comparison) => {
    const { name } = comparison;

    return postComparison({
      name,
      comparisonPoints: getComparisonPointsData(comparison)
    })
      .then(({ id }) => {
        queryClient?.invalidateQueries(['ERM', 'Comparisons']);
        history.push(`/comparisons-erm/${id}${location.search}`);
        sendCallout('created', 'success', undefined, '', { name });
      })
      .catch(response => {
        response.json()
          .then(({ errors }) => {
            errors.forEach(err => (
              sendCallout('created', 'error', undefined, err.message)
            ));
          })
          .catch(() => sendCallout('created', 'error', 'unknownError'));
      });
  };

  return (
    <View
      data={{
        entitlements: entitlementsWithIds
      }}
      handlers={{
        ...handlers,
        onClose: handleClose,
        onEResourceAdded: handleEResourceAdded,
        onEResourceRemoved: handleEResourceRemoved
      }}
      onSubmit={handleSubmit}
    />
  );
};

ComparisonCreateRoute.propTypes = {
  handlers: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    comparisons: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }).isRequired,
    entitlementQueryParams: PropTypes.shape({
      update: PropTypes.func,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    entitlements: PropTypes.object,
    entitlementQueryParams: PropTypes.shape({
      entitlementsCount: PropTypes.number,
    })
  }).isRequired,
};;

export default ComparisonCreateRoute;

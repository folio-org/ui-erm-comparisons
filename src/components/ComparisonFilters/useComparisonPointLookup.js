import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';
import { useOkapiKy } from '@folio/stripes/core';

import { AGREEMENTS_ENDPOINT, PACKAGES_ENDPOINT } from '../../constants/endpoints';

/*
 * A specialised hook designed to take in a "filterState" of
 * the shape set up by ComparisonFilters,
 * find a list of ids which need to be looked up,
 * look up both agreements and packages with those ids,
 * then combine the results into a single object, keyed by the ids.
 */
const useComparisonPointLookup = (filterState) => {
  const ky = useOkapiKy();
  // Store a memoized list of ids we don't have a name for
  const lookupIds = useMemo(() => {
    const ids = [];
    const comparisonPointOneState = filterState.comparisonPointOne;
    const comparisonPointTwoState = filterState.comparisonPointTwo;

    if (
      !!comparisonPointOneState?.id &&
      !comparisonPointOneState?.name) {
      ids.push(comparisonPointOneState?.id);
    }

    if (
      !!comparisonPointTwoState?.id &&
      !comparisonPointTwoState?.name) {
      ids.push(comparisonPointTwoState?.id);
    }
    return ids;
  }, [filterState.comparisonPointOne, filterState.comparisonPointTwo]);

  // Translate those ids into query paramaters
  const lookupQueryParams = useMemo(() => {
    return generateKiwtQueryParams({
      filters: [
        {
          path: 'id',
          values: lookupIds
        }
      ],
      stats: false
    }, {});
  }, [lookupIds]);

  // lookup any agreements/packages with those ids
  const { data: agreementsLookupData = [] } = useQuery(
    ['ERM', 'Agreements', lookupQueryParams, AGREEMENTS_ENDPOINT],
    () => ky.get(`${AGREEMENTS_ENDPOINT}?${lookupQueryParams?.join('&')}`).json(),
    {
      enabled: lookupIds?.length > 0
    }
  );

  const { data: packagesLookupData = [] } = useQuery(
    ['ERM', 'Packages', lookupQueryParams, PACKAGES_ENDPOINT],
    () => ky.get(`${PACKAGES_ENDPOINT}?${lookupQueryParams?.join('&')}`).json(),
    {
      enabled: lookupIds?.length > 0
    }
  );

  const fetchedResources = useMemo(() => {
    let obj = {};
    agreementsLookupData.forEach(ag => {
      obj = { ...obj, [ag.id]: ag };
    });

    packagesLookupData.forEach(pk => {
      obj = { ...obj, [pk.id]: pk };
    });

    return obj;
  }, [agreementsLookupData, packagesLookupData]);

  return {
    agreementsLookupData,
    fetchedResources,
    lookupIds,
    packagesLookupData
  };
};

export default useComparisonPointLookup;

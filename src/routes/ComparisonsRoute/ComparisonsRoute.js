import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { generateKiwtQueryParams, useKiwtSASQuery } from '@k-int/stripes-kint-components';

import {
  getRefdataValuesByDesc,
  useInfiniteFetch,
  usePrevNextPagination
} from '@folio/stripes-erm-components';
import { useOkapiKy } from '@folio/stripes/core';
import View from '../../components/views/Comparisons';
import { COMPARISONS_ENDPOINT, resultCount } from '../../constants';
import useErmComparisonsRefdata from '../../hooks/useErmComparisonsRefdata';

const { RESULT_COUNT_INCREMENT_MEDIUM } = resultCount;

const [
  RESULT,
  STATUS,
] = [
  'PersistentJob.Result',
  'PersistentJob.Status',
];

const ComparisonsRoute = ({
  children,
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();
  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  const refdata = useErmComparisonsRefdata({
    desc: [
      RESULT,
      STATUS,
    ]
  });

  const { query, querySetter, queryGetter } = useKiwtSASQuery();
  const { currentPage } = usePrevNextPagination();

  const comparisonsQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      page: currentPage,
      searchKey: 'name',
      filterKeys: {
        status: 'status.value',
        result: 'result.value',
        'comparisonPointOne': 'comparisonPoints.titleList.id',
        'comparisonPointTwo': 'comparisonPoints.titleList.id',
      },
      perPage: RESULT_COUNT_INCREMENT_MEDIUM
    }, (query ?? {}))
  ), [currentPage, query]);


  const {
    infiniteQueryObject: {
      error: comparisonsError,
      fetchNextPage: fetchNextComparisonsPage,
      isLoading: areComparisonsLoading,
      isError: isComparisonsError
    },
    results: comparisons = [],
    total: comparisonsCount = 0
  } = useInfiniteFetch(
    ['ERM', 'Comparisons', comparisonsQueryParams, COMPARISONS_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...comparisonsQueryParams, `offset=${pageParam}`];
      return ky.get(`${COMPARISONS_ENDPOINT}?${params?.join('&')}`).json();
    }
  );

  useEffect(() => {
    if (comparisonsCount === 1) {
      history.push(`/comparisons-erm/${comparisons[0].id}${location.search}`);
    }
  }, [comparisons, comparisonsCount, history, location.search]);

  return (
    <View
      data={{
        comparisons,
        resultValues: getRefdataValuesByDesc(refdata, RESULT),
        statusValues: getRefdataValuesByDesc(refdata, STATUS),
      }}
      history={history}
      onNeedMoreData={(_askAmount, index) => fetchNextComparisonsPage({ pageParam: index })}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={{ // Fake source from useQuery return values;
        totalCount: () => comparisonsCount,
        loaded: () => !areComparisonsLoading,
        pending: () => areComparisonsLoading,
        failure: () => isComparisonsError,
        failureMessage: () => comparisonsError.message
      }}
    >
      {children}
    </View>
  );
};

ComparisonsRoute.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default ComparisonsRoute;

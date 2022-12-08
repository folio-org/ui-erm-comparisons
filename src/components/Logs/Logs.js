import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { useOkapiKy } from '@folio/stripes/core';
import { Accordion, Badge } from '@folio/stripes/components';
import { LogsList, useInfiniteFetch } from '@folio/stripes-erm-components';

import { resultCount } from '../../constants';

const Logs = ({
  comparison,
  id,
  type
}) => {
  const ky = useOkapiKy();

  const LOGS_ENDPOINT = `erm/jobs/${comparison.id}/${type}Log`;

  // LOGS INFINITE FETCH
  const logQueryParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        perPage: resultCount.RESULT_COUNT_INCREMENT
      },
      {}
    )
  ), []);

  const {
    infiniteQueryObject: {
      fetchNextPage: fetchNextLogsPage,
    },
    results: logs = [],
  } = useInfiniteFetch(
    ['ERM', 'Job', comparison.id, 'Logs', type, LOGS_ENDPOINT, logQueryParams],
    ({ pageParam = 0 }) => {
      const params = [...logQueryParams, `offset=${pageParam}`];
      return ky.get(`${LOGS_ENDPOINT}?${params?.join('&')}`).json();
    }
  );

  return (
    <Accordion
      displayWhenClosed={<Badge>{comparison[`${type}LogCount`]}</Badge>}
      displayWhenOpen={<Badge>{comparison[`${type}LogCount`]}</Badge>}
      id={id}
      label={<FormattedMessage id={`ui-erm-comparisons.${type}Log`} />}
    >
      <LogsList
        job={comparison}
        logs={logs}
        onNeedMoreLogs={(_askAmount, index) => fetchNextLogsPage({ pageParam: index })}
        type={type}
      />
    </Accordion>
  );
};

Logs.propTypes = {
  id: PropTypes.string,
  comparison: PropTypes.object,
  type: PropTypes.string.isRequired,
};

export default Logs;

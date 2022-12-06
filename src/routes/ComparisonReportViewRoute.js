import { useQuery } from 'react-query';

import PropTypes from 'prop-types';
import { useOkapiKy } from '@folio/stripes/core';

import View from '../components/views/ComparisonReport';
import { COMPARISON_DOWNLOAD_FILE_OBJECT_ENDPOINT, COMPARISON_ENDPOINT } from '../constants';


const ComparisonReportViewRoute = ({
  history,
  location,
  match: { params: { id: comparisonId } = {} } = {},
}) => {
  const comparisonPath = COMPARISON_ENDPOINT(comparisonId);
  const comparisonReportPath = COMPARISON_DOWNLOAD_FILE_OBJECT_ENDPOINT(comparisonId);

  const ky = useOkapiKy();

  const handleClose = () => {
    history.push(location?.pathname?.replace('/report', ''));
  };

  const { data: comparison, isLoading: isComparisonLoading } = useQuery(
    ['ERM', 'Comparison', comparisonId, comparisonPath],
    () => ky.get(comparisonPath).json()
  );

  const { data: comparisonReport, isLoading: isComparisonReportLoading } = useQuery(
    ['ERM', 'Comparison', comparisonId, 'report', comparisonReportPath],
    () => ky.get(comparisonReportPath).json()
  );

  return (
    <View
      data={{
        comparisonPointData: comparison ?? {},
        report: comparisonReport ?? []
      }}
      isLoading={isComparisonLoading || isComparisonReportLoading}
      onClose={handleClose}
    />
  );
};

ComparisonReportViewRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
};

export default ComparisonReportViewRoute;

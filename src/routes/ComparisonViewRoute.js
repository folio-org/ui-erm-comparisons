import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useCallout, useOkapiKy } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';

import View from '../components/views/ComparisonView';
import { COMPARISON_ENDPOINT } from '../constants';

const ComparisonViewRoute = ({
  history,
  location,
  match: { params: { id: comparisonId } = {} } = {},
}) => {
  const ky = useOkapiKy();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const callout = useCallout();
  const queryClient = useQueryClient();

  const comparisonPath = COMPARISON_ENDPOINT(comparisonId);

  const { data: comparison, isLoading: isComparisonLoading } = useQuery(
    ['ERM', 'Comparison', comparisonId, comparisonPath],
    () => ky.get(comparisonPath).json()
  );

  const name = comparison?.name ?? '';

  const { mutateAsync: deleteComparison } = useMutation(
    ['ERM', 'Comparison', comparisonId, comparisonPath, 'delete'],
    () => ky.delete(comparisonPath).then(() => {
      queryClient.invalidateQueries(['ERM', 'Comparisons']);
      callout.sendCallout({
        message: <FormattedMessage
          id="ui-erm-comparisons.comparison.deleted.success"
          values={{ name }}
        />
      });
    })
  );

  const downloadBlob = (downloadName) => (
    blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  );

  const handleClose = () => {
    history.push(`/comparisons-erm${location.search}`);
  };

  const { refetch: exportReportAsJSON } = useQuery(
    ['ERM', 'Comparison', comparisonId, comparisonPath, 'exportReport'],
    () => ky.get(`erm/jobs/${comparisonId}/downloadFileObject`).blob().then(downloadBlob(name)),
    {
      enabled: false
    }
  );

  const handleViewReport = () => {
    history.push(`${location.pathname}/report${location.search}`);
  };

  const deleteMessageId = 'ui-erm-comparisons.comparison.delete.message';
  const deleteHeadingId = 'ui-erm-comparisons.comparison.delete.heading';

  const isPaneLoading = () => {
    return (
      comparisonId !== comparison?.id &&
      isComparisonLoading
    );
  };

  return (
    <>
      <View
        data={{
          comparison
        }}
        handlers={{
          onExportReportAsJSON: exportReportAsJSON,
        }}
        isLoading={isPaneLoading()}
        onClose={handleClose}
        onDelete={() => setShowConfirmDelete(true)}
        onViewReport={handleViewReport}
      />
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={<FormattedMessage id="ui-erm-comparisons.comparison.delete.confirmLabel" />}
        heading={<FormattedMessage id={deleteHeadingId} />}
        id="delete-comparison-confirmation"
        message={<FormattedMessage id={deleteMessageId} values={{ name }} />}
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={() => {
          deleteComparison();
          setShowConfirmDelete(false);
        }}
        open={showConfirmDelete}
      />
    </>
  );
};

ComparisonViewRoute.propTypes = {
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
  mutator: PropTypes.shape({
    comparison: PropTypes.object,
    titleListQueryParams: PropTypes.shape({
      update: PropTypes.func.isRequired,
    })
  }).isRequired,
  resources: PropTypes.shape({
    comparison: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default ComparisonViewRoute;

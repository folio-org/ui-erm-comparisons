import { useMutation, useQueryClient } from 'react-query';

import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { useCallout, useOkapiKy } from '@folio/stripes/core';

import View from '../../components/views/ComparisonForm';

const ComparisonCreateRoute = ({
  handlers = {},
  history,
  location,
}) => {
  const callout = useCallout();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  // MUTATION FOR POSTing ComparisonJob
  const { mutateAsync: postComparison } = useMutation(
    ['ERM', 'Comparisons', 'POST', 'erm/jobs/comparison'],
    (payload) => ky.post('erm/jobs/comparison', { json: { ...payload } }).json()
  );

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
      handlers={{
        ...handlers,
        onClose: handleClose,
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
};

export default ComparisonCreateRoute;

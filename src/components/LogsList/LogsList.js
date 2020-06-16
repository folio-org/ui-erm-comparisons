import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { MultiColumnList, NoValue, Spinner } from '@folio/stripes/components';
import { resultCount } from '../../constants';

export default class LogsList extends React.Component {
  static propTypes = {
    comparison: PropTypes.object,
    logs: PropTypes.arrayOf(PropTypes.shape({
      recordNumber: PropTypes.string,
      message: PropTypes.string,
    })),
    onNeedMoreLogs: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  render() {
    const { comparison, logs, onNeedMoreLogs, type } = this.props;

    if (!logs) return <Spinner />;
    if (!logs.length) return <FormattedMessage id={`ui-local-kb-admin.${type}LogNo`} />;

    return (
      <MultiColumnList
        columnMapping={{
          recordNumber: <FormattedMessage id="ui-local-kb-admin.columns.recordNumber" />,
          message: <FormattedMessage id={`ui-local-kb-admin.columns.${type}LogMessage`} />,
        }}
        contentData={logs}
        formatter={{ recordNumber: ({ recordNumber }) => (recordNumber ?? <NoValue />) }}
        id={`list-${type}Log`}
        interactive={false}
        maxHeight={800}
        onNeedMoreData={onNeedMoreLogs}
        pageAmount={resultCount.RESULT_COUNT_INCREMENT}
        pagingType="click"
        totalCount={comparison[`${type}LogCount`]}
        virtualize
        visibleColumns={['recordNumber', 'message']}
      />
    );
  }
}

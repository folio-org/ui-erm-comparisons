import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';

import View from '../components/views/ComparisonReport';

class ComparisonReportViewRoute extends React.Component {
  static manifest = Object.freeze({
    report: {
      type: 'okapi',
      path: 'erm/jobs/:{id}/downloadFileObject',
      shouldRefresh: () => false,
    },
    comparison: {
      type: 'okapi',
      path: 'erm/jobs/:{id}',
      shouldRefresh: () => false,
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      comparison: PropTypes.object,
      titleListQueryParams: PropTypes.shape({
        update: PropTypes.func.isRequired,
      })
    }).isRequired,
    resources: PropTypes.shape({
      comparison: PropTypes.object,
      report: PropTypes.object
    }).isRequired,
    stripes: PropTypes.shape({
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  handleClose = () => {
    const { history, location } = this.props;
    history.push(location?.pathname?.replace('/report', ''));
  };

  render() {
    const comparisonPointData = this.props.resources?.comparison?.records?.[0]?.comparisonPoints || [];
    return (
      <View
        data={{
          comparisonPointData,
          report: this.props.resources.report?.records
        }}
        onClose={this.handleClose}
      />
    );
  }
}

export default stripesConnect(ComparisonReportViewRoute);

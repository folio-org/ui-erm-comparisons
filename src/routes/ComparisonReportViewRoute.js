import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { cloneDeep } from 'lodash';

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
    agreements: {
      type: 'okapi',
      params: (_q, _p, _r, _l, props) => {
        const filters = (props.resources?.comparison?.records?.[0]?.comparisonPoints || [])
          .map(cp => `id==${cp.titleList.id}`)
          .join('||');
        return filters ? { filters } : null;
      },
      path: 'erm/sas',
      recordsRequired: '%{titleListQueryParams.noOfComparisonPoints}',
      perRequest: '%{titleListQueryParams.noOfComparisonPoints}',
      limitParam: 'perPage',
    },
    packages: {
      type: 'okapi',
      params: (_q, _p, _r, _l, props) => {
        const filters = (props.resources?.comparison?.records?.[0]?.comparisonPoints || [])
          .map(cp => `id==${cp.titleList.id}`)
          .join('||');
        return filters ? { filters } : null;
      },
      path: 'erm/resource/electronic',
      perRequest: '%{titleListQueryParams.noOfComparisonPoints}',
      limitParam: 'perPage',
    },
    titleListQueryParams: { noOfComparisonPoints: 2 },
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

  componentDidUpdate(prevProps) {
    const { mutator, resources } = this.props;
    const { comparison: { records } } = resources;
    if (records.length && records.length !== prevProps.resources?.comparison?.records?.length) {
      mutator.titleListQueryParams.update({ noOfComparisonPoints: records[0].comparisonPoints.length });
    }
  }

  handleClose = () => {
    const { history, location } = this.props;
    history.push(location?.pathname?.replace('/report', ''));
  };

  enrichComparisonPointData(cpArray) {
    const aArray = this.props.resources?.agreements?.records ?? [];
    const pArray = this.props.resources?.packages?.records ?? [];

    const newCpArray = cloneDeep(cpArray);
    cpArray.forEach((cp, index) => {
      const cpId = cp.titleList.id;
      const agreement = aArray.filter(a => a.id === cpId)?.[0] ?? {};
      const pkg = pArray.filter(p => p.id === cpId)?.[0] ?? {};
      if (agreement.name) {
        newCpArray[index].titleList.name = agreement.name;
      } else if (pkg.name) {
        newCpArray[index].titleList.name = pkg.name;
      }
    });
    return newCpArray;
  }

  render() {
    const comparisonPoints = this.props.resources?.comparison?.records?.[0]?.comparisonPoints || [];
    const comparisonPointData = this.enrichComparisonPointData(comparisonPoints);
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

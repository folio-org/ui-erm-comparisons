import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import View from '../components/views/ComparisonReport';

class ComparisonReportViewRoute extends React.Component {
  static manifest = Object.freeze({
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
    }).isRequired,
    resources: PropTypes.shape({
      comparison: PropTypes.object,
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
    const { resources } = this.props;
    return (
      <View
        data={resources.comparison?.records?.[0]}
        onClose={this.handleClose}
      />
    );
  }
}

export default stripesConnect(ComparisonReportViewRoute);

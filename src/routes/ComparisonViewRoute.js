import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import { ConfirmationModal } from '@folio/stripes/components';

import View from '../components/views/ComparisonView';

class ComparisonViewRoute extends React.Component {
  static manifest = Object.freeze({
    comparison: {
      type: 'okapi',
      path: 'erm/jobs/:{id}',
      shouldRefresh: () => false,
    }
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
    }).isRequired,
    stripes: PropTypes.shape({
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  static contextType = CalloutContext;

  state = { showConfirmDelete: false };

  handleDelete = () => {
    const { resources } = this.props;
    const comparison = resources?.comparison?.records?.[0] ?? {};
    const name = comparison?.name ?? '';
    this.props.mutator.comparison
      .DELETE(comparison)
      .then(() => {
        this.props.history.replace(
          {
            pathname: '/comparisons-erm',
            search: this.props.location.search,
          }
        );
        this.context.sendCallout({ message: <SafeHTMLMessage id="ui-erm-comparisons.comparison.deleted.success" values={{ name }} /> });
      });
  };

  handleClose = () => {
    this.props.history.push(`/comparisons-erm${this.props.location.search}`);
  };

  handleViewReport = () => {
    const { history, location } = this.props;
    history.push(`${location.pathname}/report${location.search}`);
  }

  showDeleteConfirmationModal = () => this.setState({ showConfirmDelete: true });

  hideDeleteConfirmationModal = () => this.setState({ showConfirmDelete: false });

  render() {
    const { resources } = this.props;
    const comparison = resources?.comparison?.records?.[0] ?? {};
    const name = comparison?.name ?? '';


    const deleteMessageId = 'ui-erm-comparisons.comparison.delete.message';
    const deleteHeadingId = 'ui-erm-comparisons.comparison.delete.heading';

    return (
      <>
        <View
          data={{
            comparison
          }}
          isLoading={resources?.comparison?.isPending ?? true}
          onClose={this.handleClose}
          onDelete={this.showDeleteConfirmationModal}
          onViewReport={this.handleViewReport}
        />
        {this.state.showConfirmDelete && (
          <ConfirmationModal
            buttonStyle="danger"
            confirmLabel={<FormattedMessage id="ui-erm-comparisons.comparison.delete.confirmLabel" />}
            heading={<FormattedMessage id={deleteHeadingId} />}
            id="delete-comparison-confirmation"
            message={<SafeHTMLMessage id={deleteMessageId} values={{ name }} />}
            onCancel={this.hideDeleteConfirmationModal}
            onConfirm={this.handleDelete}
            open
          />
        )}
      </>
    );
  }
}

export default stripesConnect(ComparisonViewRoute);

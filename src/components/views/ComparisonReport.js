import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import {
  IconButton,
  LoadingPane,
  Pane,
  PaneMenu,
  Paneset
} from '@folio/stripes/components';

import ComparisonReportList from './ComparisonReportList';

export default class ComparisonReport extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-comparisons.report.close">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-report-button"
              onClick={this.props.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  render() {
    const paneProps = {
      defaultWidth: 'fill',
      id: 'pane-report',
      onClose: this.props.onClose,
    };

    if (this.props.isLoading) return <LoadingPane data-loading {...paneProps} />;

    const { comparisonPointData: { name } } = this.props.data;

    return (
      <Paneset>
        <Pane
          firstMenu={this.renderFirstMenu()}
          paneTitle={name}
          {...paneProps}
        >
          <ComparisonReportList sourceData={this.props.data} />
        </Pane>
      </Paneset>
    );
  }
}

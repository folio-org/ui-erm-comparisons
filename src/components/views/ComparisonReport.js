import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import {
  Button,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

export default class ComparisonReport extends React.Component {
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
    console.log("PROPS: %o", this.props)
    return (
      <Pane
        defaultWidth="100%"
        firstMenu={this.renderFirstMenu()}
        id="pane-report"
        paneTitle={<FormattedMessage id="ui-erm-comparisons.report.paneTitle" />}
      >
        The report
      </Pane>
    );
  }
}

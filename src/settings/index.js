import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';

export default class ERMComparisonSettings extends React.Component {
  sections = [
    {
      label: <FormattedMessage id="ui-erm-comparisonss.settings.general" />,
      pages: [
      ]
    },
  ]

  render() {
    return (
      <Settings
        {...this.props}
        navPaneWidth="20%"
        paneTitle={<FormattedMessage id="ui-erm-comparisonss.meta.title" />}
        sections={this.sections}
      />
    );
  }
}

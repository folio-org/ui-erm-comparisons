import React from 'react';
import { FormattedMessage } from 'react-intl';

const appKeyboardShortcuts = [
  {
    label: (<FormattedMessage id="ui-erm-comparisons.shortcut.createRecord" />),
    name: 'new',
    shortcut: 'alt + n',
  },
  {
    label: (<FormattedMessage id="ui-erm-comparisons.shortcut.saveRecord" />),
    name: 'save',
    shortcut: 'mod + s',
  },
  {
    label: (<FormattedMessage id="ui-erm-comparisons.shortcut.expandAll" />),
    name: 'expandAllSections',
    shortcut: 'mod + alt + b'
  },
  {
    label: (<FormattedMessage id="ui-erm-comparisons.shortcut.collapseAll" />),
    name: 'collapseAllSections',
    shortcut: 'mod + alt + g'
  },
  {
    label: (<FormattedMessage id="ui-erm-comparisons.shortcut.expandOrCollapse" />),
    name: 'expandOrCollapseAccordion',
    shortcut: 'spacebar'
  },
  {
    label: (<FormattedMessage id="ui-erm-comparisons.shortcut.goToSearchFilter" />),
    name: 'search',
    shortcut: 'mod + alt + h',
  },
];

export default appKeyboardShortcuts;

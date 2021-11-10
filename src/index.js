import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { AppContextMenu, Route } from '@folio/stripes/core';

import {
  CommandList,
  HasCommand,
  KeyboardShortcutsModal,
  NavList,
  NavListItem,
  NavListSection,
  checkScope,
  importShortcuts,
} from '@folio/stripes/components';

import ComparisonCreateRoute from './routes/ComparisonCreateRoute';
import ComparisonsRoute from './routes/ComparisonsRoute';
import ComparisonViewRoute from './routes/ComparisonViewRoute';
import ComparisonReportViewRoute from './routes/ComparisonReportViewRoute';

import Settings from './settings';

const appSpecificShortcuts = importShortcuts(['new', 'save', 'expandAllSections', 'collapseAllSections', 'expandOrCollapseAccordion', 'search']);
export default class App extends React.Component {
  static propTypes = {
    actAs: PropTypes.string.isRequired,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
  }

  state = {
    showKeyboardShortcutsModal: false,
  };

  changeKeyboardShortcutsModal = (modalState) => {
    this.setState({ showKeyboardShortcutsModal: modalState });
  };

  shortcutModalToggle(handleToggle) {
    handleToggle();
    this.changeKeyboardShortcutsModal(true);
  }

  searchInput = () => {
    return this.props.location.pathname.search('/comparisons-erm') === 0 ?
      'input-erm-comparisons-search' :
      undefined;
  }

  focusSearchField = () => {
    const { history, stripes } = this.props;
    const el = document.getElementById(this.searchInput());
    if (el) {
      el.focus();
    } else {
      history.push(stripes.home);
    }
  }

  shortcuts = [
    {
      name: 'search',
      handler: this.focusSearchField
    },
    {
      name: 'openShortcutModal',
      handler: this.changeKeyboardShortcutsModal
    },
  ];

  render() {
    const { actAs, match: { path } } = this.props;

    if (actAs === 'settings') {
      return (
        <Settings {...this.props} />
      );
    }

    return (
      <>
        <CommandList commands={appSpecificShortcuts}>
          <HasCommand
            commands={this.shortcuts}
            isWithinScope={checkScope}
            scope={document.body}
          >
            <AppContextMenu>
              {(handleToggle) => (
                <NavList>
                  <NavListSection>
                    <NavListItem
                      id="keyboard-shortcuts-item"
                      onClick={() => { this.shortcutModalToggle(handleToggle); }}
                    >
                      <FormattedMessage id="ui-agreements.appMenu.keyboardShortcuts" />
                    </NavListItem>
                  </NavListSection>
                </NavList>
              )}
            </AppContextMenu>
            <Switch>
              <Route component={ComparisonCreateRoute} path={`${path}/create`} />
              <Route component={ComparisonReportViewRoute} path={`${path}/:id/report`} />
              <Route component={ComparisonsRoute} path={`${path}/:id?`}>
                <Route component={ComparisonViewRoute} path={`${path}/:id`} />
              </Route>
            </Switch>
          </HasCommand>
        </CommandList>
        {this.state.showKeyboardShortcutsModal && (
          <KeyboardShortcutsModal
            allCommands={appSpecificShortcuts}
            onClose={() => { this.changeKeyboardShortcutsModal(false); }}
            open
          />
        )}
      </>
    );
  }
}

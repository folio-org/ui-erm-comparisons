import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';

import {
  CommandList,
  HasCommand,
  checkScope,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';

import ComparisonCreateRoute from './routes/ComparisonCreateRoute';
import ComparisonsRoute from './routes/ComparisonsRoute';
import ComparisonViewRoute from './routes/ComparisonViewRoute';
import ComparisonReportViewRoute from './routes/ComparisonReportViewRoute';

import Settings from './settings';

export default class App extends React.Component {
  static propTypes = {
    actAs: PropTypes.string.isRequired,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
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
  ];

  render() {
    const { actAs, match: { path } } = this.props;

    if (actAs === 'settings') {
      return (
        <Settings {...this.props} />
      );
    }

    return (
      <CommandList commands={defaultKeyboardShortcuts}>
        <HasCommand
          commands={this.shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <Switch>
            <Route component={ComparisonCreateRoute} path={`${path}/create`} />
            <Route component={ComparisonReportViewRoute} path={`${path}/:id/report`} />
            <Route component={ComparisonsRoute} path={`${path}/:id?`}>
              <Route component={ComparisonViewRoute} path={`${path}/:id`} />
            </Route>
          </Switch>
        </HasCommand>
      </CommandList>
    );
  }
}

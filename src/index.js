import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';

const ComparisonCreateRoute = lazy(() => import('./routes/ComparisonCreateRoute'));
const ComparisonsRoute = lazy(() => import('./routes/ComparisonsRoute'));
const ComparisonViewRoute = lazy(() => import('./routes/ComparisonViewRoute'));
const ComparisonReportViewRoute = lazy(() => import('./routes/ComparisonReportViewRoute'));

const Settings = lazy(() => import('./settings'));

export default class App extends React.Component {
  static propTypes = {
    actAs: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
  }

  render() {
    const { actAs, match: { path } } = this.props;

    if (actAs === 'settings') {
      return (
        <Suspense fallback={null}>
          <Settings {...this.props} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={null}>
        <Switch>
          <Route component={ComparisonCreateRoute} path={`${path}/create`} />
          <Route component={ComparisonReportViewRoute} path={`${path}/:id/report`} />
          <Route component={ComparisonsRoute} path={`${path}/:id?`}>
            <Suspense fallback={null}>
              <Route component={ComparisonViewRoute} path={`${path}/:id`} />
            </Suspense>
          </Route>
        </Switch>
      </Suspense>
    );
  }
}

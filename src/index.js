import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import { Route } from '@folio/stripes/core';

const ComparisonsRoute = lazy(() => import('./routes/ComparisonsRoute'));
const ComparisonViewRoute = lazy(() => import('./routes/ComparisonViewRoute'));

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

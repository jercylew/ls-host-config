import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
import HomeUrlPrefix from './HomeUrlPrefix';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const BleMeshAdvancedConfig = lazy(() => import('./view/BleMeshAdvancedConfig'));
const BleMeshOverviewConfig = lazy(() => import('./view/BleMeshOverviewConfig'));
const BleMeshDetailsConfig = lazy(() => import('./view/BleMeshDetailsConfig'));
const ElectricMonitorConfig = lazy(() => import('./view/ElectricMonitorConfig'));
const SystemConfig = lazy(() => import('./view/SystemConfig'));
const SceneConfig = lazy(() => import('./view/SceneConfig'));

const urlPrefix = HomeUrlPrefix();

class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path={`/${urlPrefix}/dashboard`} component={ Dashboard } />
          <Route exact path={`/${urlPrefix}/scene`} component={ SceneConfig } />
          <Route exact path={`/${urlPrefix}/electric-monitor`} component={ ElectricMonitorConfig } />
          <Route exact path={`/${urlPrefix}/ble-mesh/overview`} component={ BleMeshOverviewConfig } />
          <Route exact path={`/${urlPrefix}/ble-mesh/mesh`} component={ BleMeshDetailsConfig } />
          <Route exact path={`/${urlPrefix}/ble-mesh/advanced`} component={ BleMeshAdvancedConfig } />
          <Route exact path={`/${urlPrefix}/system`} component={ SystemConfig } />
          <Redirect to={`/${urlPrefix}/dashboard`} />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
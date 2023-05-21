import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
import HomeUrlPrefix from './HomeUrlPrefix';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const Buttons = lazy(() => import('./basic-ui/Buttons'));
const CurrentVideo = lazy(() => import('./basic-ui/CurrentVideo'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));
const BasicElements = lazy(() => import('./form-elements/BasicElements'));
const BasicTable = lazy(() => import('./tables/BasicTable'));
const Mdi = lazy(() => import('./icons/Mdi'));
const ChartJs = lazy(() => import('./charts/ChartJs'));
const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));
const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));
const Lockscreen = lazy(() => import('./user-pages/Lockscreen'));
const BlankPage = lazy(() => import('./general-pages/BlankPage'));

const CurrentView = lazy(() => import('./charts/CurrentView'));
const SmartMeterView = lazy(() => import('./charts/SmartMeterView'));
const VoltameterView = lazy(() => import('./charts/VoltameterView'));
const SceneOverview = lazy(() => import('./view/SceneOverview'));
const SceneDetail = lazy(() => import('./view/SceneDetail'));
const SceneConfig = lazy(() => import('./view/SceneConfig'));

const urlPrefix = HomeUrlPrefix();

class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path={`/${urlPrefix}/dashboard`} component={ Dashboard } />
          <Route exact path={`/${urlPrefix}/scene`} component={ SceneOverview } />
          <Route exact path={`/${urlPrefix}/scene/detail`} component={ SceneDetail } />
          <Route exact path={`/${urlPrefix}/scene/config`} component={ SceneConfig } />
          <Route path={`/${urlPrefix}/config-helper`} component={ BlankPage } />
          <Route exact path={`/${urlPrefix}/demo/current`} component={ CurrentView } />
          <Route exact path={`/${urlPrefix}/demo/current/video`} component={ CurrentVideo } />
          <Route path={`/${urlPrefix}/demo/smart-meter`} component={ SmartMeterView } />
          <Route path={`/${urlPrefix}/demo/voltameter`} component={ VoltameterView } />
          <Route path={`/${urlPrefix}/settings`} component={ BlankPage } />

          {/* <Route path="/basic-ui/buttons" component={ Buttons } />
          <Route path="/basic-ui/dropdowns" component={ Dropdowns } />
          <Route path="/basic-ui/typography" component={ Typography } />


          <Route path="/form-Elements/basic-elements" component={ BasicElements } />

          <Route path="/tables/basic-table" component={ BasicTable } />


          <Route path="/icons/mdi" component={ Mdi } />


          <Route path="/charts/chart-js" component={ ChartJs } />


          <Route path="/user-pages/login-1" component={ Login } />
          <Route path="/user-pages/register-1" component={ Register1 } />
          <Route path="/user-pages/lockscreen" component={ Lockscreen } />

          <Route path="/error-pages/error-404" component={ Error404 } />
          <Route path="/error-pages/error-500" component={ Error500 } />

          <Route path="/general-pages/blank-page" component={ BlankPage } /> */}
          <Redirect to={`/${urlPrefix}/dashboard`} />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
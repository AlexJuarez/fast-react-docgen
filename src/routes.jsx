import React from 'react';
import App from './containers/App';
import DemoPage from './containers/DemoPage';
import DemosPage from './containers/DemosPage';

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: DemosPage },
  childRoutes: [
    { path: 'components/:category/:title', component: DemoPage }
  ]
};

export default routes;

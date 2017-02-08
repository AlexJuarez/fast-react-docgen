import App from './containers/App';
import DemoPage from './containers/DemoPage';
import DemosPage from './containers/DemosPage';

const routes = {
  childRoutes: [
    { component: DemosPage, path: 'components/:category' },
    { component: DemoPage, path: 'components/:category/:title' },
  ],
  component: App,
  indexRoute: {
    component: DemosPage,
  },
  path: '/',
};

export default routes;

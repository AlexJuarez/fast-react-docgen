// @flow
import React from 'react';
import { Link } from 'react-router';
import type { Router } from 'react-router';
import Header from 'txl/header/Header';
import TuneLogo from 'txl/logos/TuneLogo';
import SearchBox from 'txl/input-fields/SearchBox';
import { STYLES } from 'txl/navigation/Navigation.style';

import {
  APP_CONTAINER_STYLES,
  CONTENT_COLUMN_STYLE,
  CONTENT_PANE_STYLE,
  NAVBAR_STYLE,
  PAGE_CONTAINER_STYLE,
} from '../styles';
import NavBar from './NavBar';


const ACCENT_COLOR = '#FFF';

type Props = {
  items: any,
  activeNames: Array<?string>,
  expandedNames: Array<?string>,
  children?: React.Element<*>,
  search?: string,
  router: Router,
};

const Layout = (props: Props) => {
  const { activeNames, expandedNames, items, children, search, router } = props;

  const addQuery = (name, value) => {
    const location = router.getCurrentLocation();
    location.query[name] = value;
    router.replace(location);
  };

  const removeQuery = (name) => {
    const location = router.getCurrentLocation();
    delete location.query[name];
    router.replace(location);
  };

  return (
    <div style={APP_CONTAINER_STYLES}>
      <Header
        accentColor={ACCENT_COLOR}
        logo={(<Link to="/"><TuneLogo color={ACCENT_COLOR} /></Link>)}
        title="TXL Components"
      />
      <div style={PAGE_CONTAINER_STYLE}>
        <div style={NAVBAR_STYLE}>
          <div style={{ ...STYLES.container.base, minHeight: 'auto' }}>
            <SearchBox
              placeholder="Search"
              value={search}
              onClear={() => {
                removeQuery('search');
              }}
              onChange={(e) => {
                if (!e.value.length) {
                  removeQuery('search');
                } else {
                  addQuery('search', e.value);
                }
              }}
            />
          </div>
          <NavBar
            search={search}
            items={items}
            activeNames={activeNames}
            expandedNames={expandedNames}
          />
        </div>
        <div style={CONTENT_PANE_STYLE}>
          <div style={CONTENT_COLUMN_STYLE}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

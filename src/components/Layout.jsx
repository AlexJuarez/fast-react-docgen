// @flow
import React from 'react';
import { Link } from 'react-router';
import type { Router } from 'react-router';
import Header from 'txl/header/Header';
import TuneLogo from 'txl/logos/TuneLogo';


import {
  APP_CONTAINER_STYLES,
  CONTENT_COLUMN_STYLE,
  CONTENT_PANE_STYLE,
  PAGE_CONTAINER_STYLE,
} from '../styles';
import NavBar from './NavBar';


const ACCENT_COLOR = '#FFF';

type Props = {
  items: any,
  title?: string,
  category?: string,
  children?: React.Element<*>,
  router: Router,
};

const Layout = (props: Props) => {
  const { title, category, items, children, router } = props;

  return (
    <div style={APP_CONTAINER_STYLES}>
      <Header
        accentColor={ACCENT_COLOR}
        logo={(<Link to="/"><TuneLogo color={ACCENT_COLOR} /></Link>)}
        title="TXL Components"
      />
      <div style={PAGE_CONTAINER_STYLE}>
        <NavBar
          items={items}
          title={title}
          category={category}
          router={router}
        />
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

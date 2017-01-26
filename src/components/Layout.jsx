// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from 'txl/header/Header';
import NavBar from './NavBar';
import TuneLogo from 'txl/logos/TuneLogo';
import {
  APP_CONTAINER_STYLES,
  CONTENT_COLUMN_STYLE,
  CONTENT_PANE_STYLE,
  NAVBAR_STYLE,
  PAGE_CONTAINER_STYLE,
} from '../styles';

const ACCENT_COLOR = '#FFF';

type Props = {
  items: any,
  activeNames: Array<?string>,
  children?: React.Element<*>
};

class Layout extends Component {
  props: Props;

  render() {
    const { activeNames, items, children } = this.props;

    return (
      <div style={APP_CONTAINER_STYLES}>
        <Header
          accentColor={ACCENT_COLOR}
          logo={(<Link to="/"><TuneLogo color={ACCENT_COLOR} /></Link>)}
          title="TXL Components"
        />
        <div style={PAGE_CONTAINER_STYLE}>
          <div style={NAVBAR_STYLE}>
            <NavBar items={items} activeNames={activeNames} />
          </div>
          <div style={CONTENT_PANE_STYLE}>
            <div style={CONTENT_COLUMN_STYLE}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Layout;

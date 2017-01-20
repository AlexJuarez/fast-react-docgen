import React, { Component } from 'react';
import NavBarItem from 'NavBar/NavBarItem';

type NavItem = {
  title: string,
  file: string,
};

type Props = {
  categories: {
    [key: string]: NavItem
  }
};

export default class NavBar extends Component {
  render() {

  }
}
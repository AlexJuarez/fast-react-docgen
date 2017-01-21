import React, { Component } from 'react';

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
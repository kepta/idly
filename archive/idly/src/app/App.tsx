import * as React from 'react';

import Breadcrumb from 'antd/lib/breadcrumb';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';

import { plugins } from 'plugins';
import { Map } from '../map2/map';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
require('./App.css');

export class App extends React.PureComponent {
  state = {
    comp: []
  };
  constructor() {
    super();
    plugins.then(x => {
      if (!x) return;
      this.setState({
        comp: x.components
      });
    });
  }
  render() {
    return (
      <div className="app">
        <header />
        <div id="toolbar" />
        <nav id="plugins-bar">
          {this.state.comp.map((C, i) => (
            <Card
              loading={this.state.comp.length === 0}
              title={C.pluginName}
              key={i}
              style={{ marginBottom: 5 }}>
              <C.component />
            </Card>
          ))}
        </nav>
        <main>
          <Map />
        </main>
        <footer />
      </div>
    );
  }
}

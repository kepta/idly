import * as React from 'react';

import Breadcrumb from 'antd/lib/breadcrumb';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';

import { plugins } from 'plugins';
import { Map } from '../map/map';

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
    return (
      <Layout>
        <Layout style={{ marginRight: 400, marginBottom: 28 }}>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Layout style={{ padding: '0 12px 12px' }}>
              <Breadcrumb style={{ margin: '12px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                style={{
                  background: '#404040',
                  padding: 8,
                  margin: 0,
                  minHeight: 280,
                  display: 'flex'
                }}>
                <Map />
              </Content>
            </Layout>
          </Layout>
        </Layout>
        <Sider
          width={400}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            right: 0,
            background: '#fff'
          }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}>
            {this.state.comp.map((C, i) => (
              <SubMenu
                key={i + 'sub2'}
                title={
                  <span>
                    <Icon type="laptop" />
                    {C.pluginName}
                  </span>
                }>
                <C.component />
              </SubMenu>
            ))}
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />subnav 1
                </span>
              }>
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="laptop" />subnav 2
                </span>
              }>
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="notification" />subnav 3
                </span>
              }>
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Footer
          style={{
            overflow: 'auto',
            padding: 4,
            maxHeight: '28px !important',
            width: '100vw',
            position: 'fixed',
            bottom: 0,
            background: '#108ee9'
          }}>
          Footer
        </Footer>
      </Layout>
    );
  }
}

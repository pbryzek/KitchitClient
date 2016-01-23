'use strict';

import React from 'react-native';
const {
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  Image,
  TabBarIOS
} = React;

var style = StyleSheet.create({
  flexEnabled: {
    flex: 1
  },
  leftBackButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 7
  }
});

const backArrow = '';

class MainTabBar extends Component {
  constructor(props) {
    super(props);
    this.tabBarData = [];
    this.state = {
      selectedTab: 0
    };
    this.configureTabBar();
  }
  configureTabBar() {
    var defaultTabIndex = 1;
    React.Children.map(this.props.initialConfig, function(eachChild, index) {
      var eachTabBarData = {
        id: index,
        title: eachChild.props.title,
        icon: eachChild.props.icon,
        component: eachChild.props.children
      };
      this.tabBarData.push(eachTabBarData);

      if (eachChild.props.defaultTab) {
        defaultTabIndex = index;
      }
    }.bind(this));
    this.state = {
      selectedTab: defaultTabIndex
    };
    this.props.navComponent.setNavigatorTitle(this.tabBarData[defaultTabIndex] ? this.tabBarData[defaultTabIndex].title : '');
  }
  switchTab(tabName, tabTitle) {
    this.setState({
      selectedTab: tabName
    });
    this.props.navComponent.setNavigatorTitle(tabTitle);
    if (this.props.onChange) {
      this.props.onChange(this.state.selectedTab);
    }
  }
  renderTabBarItems() {
    var items = [];
    var self = this;
    this.tabBarData.map(function(eachData) {
      var eachComponent = React.cloneElement(eachData.component, {
        navigator: self.props.navigator,
        navComponent: self.props.navComponent
      });
      items.push(
        <TabBarIOS.Item
          key={eachData.id}
          title={eachData.title}
          icon={eachData.icon}
          selected={self.state.selectedTab === eachData.id}
          onPress={self.switchTab.bind(self, eachData.id, eachData.title)}>
          {eachComponent}
        </TabBarIOS.Item>
      );
    });
    return items;
  }
  render() {
    return (
      <TabBarIOS
        style={style.flexEnabled}
        tintColor={this.props.tabTintColor}
        barTintColor={this.props.tabBarTintColor}>
        {this.renderTabBarItems()}
      </TabBarIOS>
    );
  }
}

class TabBarNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rootNavigatorTitle: 'Default Title',
      forceReRender: true
    };
    this.currentView = null;
    this.navItems = {};
    this.navRouter = {};
    this.currentRoute = null;

    this.setNavigatorRouter();
  }
  setNavigatorRouter() {
    let self = this;
    this.navRouter = {
      LeftButton(route, navigator, index, navState) {
        if (!route.isRoot) {
          if (route.navItems && route.navItems.leftItem) {
            return React.cloneElement(route.navItems.leftItem.component, {
              onPress: () => {route.navItems.leftItem.event(self.popThisNavigator.bind(self, navigator))}
            });
          }
          else {
            return (
              <TouchableOpacity style={style.leftBackButton} onPress={() => {
                self.popThisNavigator(navigator);
              }}>
                <Text style={{color: 'white'}}>BACK</Text>
              </TouchableOpacity>
            );
          }
        }
      },
      RightButton(route, navigator, index, navState) {
        if (route.navItems) {
          if (route.navItems.rightItem) {
            return React.cloneElement(route.navItems.rightItem.component, {
              onPress: () => {route.navItems.rightItem.event()}
            });
          }
        }
      },
      Title(route, navigator, index, navState) {
        return (
          <Text style={{flex: 1, justifyContent: 'center', color: self.props.navTintColor ? self.props.navTintColor : 'ffffff', margin: 10, fontSize: 17}}>
            {route.isRoot ? self.state.rootNavigatorTitle : route.title}
          </Text>
        );
      }
    };
  }
  setNavItems(config) {
    this.currentRoute.navItems = config;
  }
  popThisNavigator(navigator) {
    this.resetNavItems();
    this.forceReRender();
    console.log('hi');
    navigator.pop();
  }
  resetNavItems() {
    this.navItems.rightItem = false;
    this.navItems.titleItem = false;
    this.navItems.leftItem = false;
  }
  forceReRender() {
    this.setState({
      forceReRender: !this.state.forceReRender
    });
  }
  renderScene(route, navigator) {
    this.currentRoute = route;
    this.resetNavItems();
    var newComponent = React.cloneElement(route.component, {
      navigator: navigator,
      navComponent: this
    });
    return (
      <View style={{flex: 1, marginTop: 64}}>
        {newComponent}
      </View>
    );
  }
  setNavigatorTitle(newTitle) {
    this.setState({
      rootNavigatorTitle: newTitle
    });
  }
  render() {
    var initialRoute = {
      title: '',
      isRoot: true,
      component: (
        <MainTabBar {...this.props} initialConfig={this.props.children} onChange={this.props.onChange}/>
      )
    };
    var navBar = (
      <Navigator.NavigationBar
        style={{backgroundColor: this.props.navBarTintColor ? this.props.navBarTintColor : 'rgba(0,0,0,.8)', alignItems: 'center'}}
        routeMapper={this.navRouter}
        />
    );
    return (
      <Navigator
        ref='navigator'
        style={[style.flexEnabled, {backgroundColor: 'transparent'}]}
        initialRoute={initialRoute}
        renderScene={this.renderScene.bind(this)}
        navigationBar={navBar}
        />
    );
  }
}

class TabBarNavigatorItem extends Component {
  render() {
    return <View/>;
  }
}

TabBarNavigator.Item = TabBarNavigatorItem;

module.exports = TabBarNavigator;

'use strict';

import React from 'react-native';
const {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AlertIOS,
  Image
} = React;

import TabBarNavigator from './index.android';

var TabOne = require('./js/tab_one.js');
var TabTwo = require('./js/tab_two.js');

var style = require('./style/style.js');
var globals = require('./js/constants/globals.js');

class Kitchit extends Component {
  render() {
    return (
      <TabBarNavigator
        navTintColor='ffffff'
        navBarTintColor='333333'
        tabTintColor='orange'
        tabBarTintColor='333333'
        onChange={(index)=>console.log('selected index ${index}')}>
        <TabBarNavigator.Item title='Upcoming Events' icon={{uri: globals.base64Icon, scale: 3}} defaultTab>
          <TabOne/>
        </TabBarNavigator.Item>
        <TabBarNavigator.Item title='Calendar' icon={{uri: globals.base64Icon, scale: 3}}>
          <TabTwo/>
        </TabBarNavigator.Item>
      </TabBarNavigator>
    );
  }
}

React.AppRegistry.registerComponent('Kitchit', () => Kitchit);

'use strict';

import React from 'react-native';
const {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AlertIOS
} = React;

var NewPage = require('./new_page.js');
var style = require('../style/style.js');

class TabTwo extends Component {
  pushPage() {
    this.props.navigator.push({
      title: 'New Page',
      component: <NewPage/>
    });
  }
  render() {
    return (
      <View style={style.tabContentStyle}>
        <Text style={style.textStyle}>This is the content of Tab 2</Text>
        <Text style={[style.textStyle, {marginBottom: 0}]}>A good implementation of</Text>
        <Text style={style.textStyle}>hidesBottomBarWhenPushed</Text>
        <Text style={style.textStyle}>Set as default by passing Props 'defaultTab'</Text>
        <TouchableOpacity onPress={this.pushPage.bind(this)}>
          <Text style={[style.textStyle, {color: 'rgb(0,122,255)'}]}>Try to push a new page</Text>
        </TouchableOpacity>
        <Text style={style.textStyle}>And see the magic on the TabBar</Text>
      </View>
    );
  }
}

module.exports = TabTwo;

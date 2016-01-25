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

var style = require('../style/style.js');

class TabTwo extends Component {
  render() {
    return (
      <View style={style.tabContentStyle}>
        <Text style={style.textStyle}>This is the content of Tab 2</Text>
      </View>
    );
  }
}

module.exports = TabTwo;

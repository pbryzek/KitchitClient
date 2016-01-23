'use strict';

import React from 'react-native';
const {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} = React;

var style = StyleSheet.create({
  rootView: {
    flex: 1
  },
  tabContentStyle: {
    flex: 1,
    backgroundColor: 'ebebeb',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    color: '#333333',
    marginBottom: 25,
    fontSize: 17
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowImage: {
    width: 200,
    height: 200,
    transform:[{rotate: '-45deg'}],
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 0,
    top: 0
  }
});

module.exports = style;

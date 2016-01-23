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

var style = require('../style/style.js');

class AnotherPage extends Component {
  constructor(props) {
    super(props);
    this.props.navComponent.setNavItems({
      leftItem: {
        component: (
          <TouchableOpacity style={[style.navItem, {marginRight: 7}]}>
            <Text style={{color: 'white', marginLeft: 7}}>TOUCH ME</Text>
          </TouchableOpacity>
        ),
        event: function(popHelper) {
          popHelper();
          AlertIOS.alert('The event comes from Left NavBar Item');
        }.bind(this)
      },
      rightItem: {
        component: (
          <TouchableOpacity style={[style.navItem, {marginRight: 7}]}>
            <Text style={{color: 'white'}}>RIGHT ITEM</Text>
          </TouchableOpacity>
        ),
        event: function() {
          AlertIOS.alert('The event comes from Share Button on NavBar');
        }.bind(this)
      }
    });
  }
  pushPage() {
    this.props.navigator.push({
      title: 'New Page',
      component: <AnotherPage/>
    });
  }
  render() {
    return (
      <View style={style.tabContentStyle}>
        <Text style={style.textStyle}>This is the content of New Page</Text>
        <Text style={style.textStyle}>You can also set the Bar Item on the Left</Text>
        <View style={{position: 'absolute', top: 20, right: 10}}>
          <Text style={style.textStyle}>I also have callback function</Text>
          <Text style={style.textStyle}>Try touch the left bar item</Text>
        </View>
        <TouchableOpacity onPress={this.pushPage.bind(this)}>
          <Text style={[style.textStyle, {color: 'rgb(0,122,255)'}]}>Touch to push page infinitely</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = AnotherPage;

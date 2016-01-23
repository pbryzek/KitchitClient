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

var AnotherPage = require('./another_page.js');
var style = require('../style/style.js');

class NewPage extends Component {
  constructor(props) {
    super(props);
    this.props.navComponent.setNavItems({
      rightItem: {
        component: (
          <TouchableOpacity style={[style.navItem, {marginRight: 7}]}>
            <Text style={{color: 'white'}}>TOUCH ME</Text>
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
      title: 'Another Page',
      component: <AnotherPage/>
    });
  }
  render() {
    return (
      <View style={style.tabContentStyle}>
        <Text style={style.textStyle}>This is the content of New Page</Text>
        <Text style={style.textStyle}>You can also set the Bar Item on the right</Text>
        <View style={{position: 'absolute', top: 20, left: 20}}>
          <Text style={style.textStyle}>Right Bar Item has callback function</Text>
          <Text style={style.textStyle}>Try touch the right bar item</Text>
        </View>
        <TouchableOpacity onPress={this.pushPage.bind(this)}>
          <Text style={[style.textStyle, {color: 'rgb(0,122,255)'}]}>Touch to push another new page</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = NewPage;

//'use strict';

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
var PARAMs = require('./js/constants/constants_params.js');
var APIs = require('./js/constants/constants_api.js');
var GLOBALs = require('./js/constants/globals.js');

class Kitchit extends Component {

  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
    this.watchID = null;
  }

  sendLocationToServer(position) {
        //TODO get the userId correctly
        var userId = 1;
        var coords = position.coords;
        var latitude = coords.latitude;
        var longitude = coords.longitude;

        var params = {};
        params[PARAMs.USERID] = userId;
        params[PARAMs.LATITUDE] = latitude;
        params[PARAMs.LONGITUDE] = longitude;

        var acceptPath = GLOBALs.createUrl(APIs.UPDATE_CHEF_LOCATION, params);

        fetch(acceptPath)
        .then((response) => response.json())
        .then((responseData) => {
                var success = responseData[PARAMs.SUCCESS];
                if(success) {
                } else {
                        var errMsg = responseData[PARAMs.ERRORMSG];
                }
        })
        .catch((error) => {
                console.warn(error);
        });
  }

  componentDidMount() { 
      navigator.geolocation.getCurrentPosition( (position) => { 
          this.sendLocationToServer(position);          
      }, (error) => alert(error.message), 
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000} ); 
      this.watchID = navigator.geolocation.watchPosition((position) => { 
          this.sendLocationToServer(position);
      }); 
   }

  componentWillUnmount() { 
      navigator.geolocation.clearWatch(this.watchID); 
  }

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

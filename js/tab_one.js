//'use strict';

import React from 'react-native';

var store = require('react-native-simple-store');

const {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  AlertIndicatorIOS,
  ActivityIndicatorIOS,
  AlertIOS
} = React;

var APIs = require('./constants/constants_api.js');
var PARAMs = require('./constants/constants_params.js');
var EventDetail = require('./event_detail.js');
var GLOBALs = require('./constants/globals.js');
var STORAGE = require('./constants/constants_storage.js'); 

//TODO get the userId correctly
var userId = 1;
var params = {};
params[PARAMs.USERID] = userId;
var upcomingEventsPath = GLOBALs.createUrl(APIs.GET_UPCOMING_EVENTS, params);

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    thumbnail: {
        width: 53,
        height: 81,
        marginRight: 10
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    author: {
        color: '#656565'
    },
    separator: {
       height: 1,
       backgroundColor: '#dddddd'
    },
    listView: {
       backgroundColor: '#F5FCFF'
    },
    loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center'
    }
});

class TabOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        })
    };
    this.events = [];
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
      this.updateList();
  }
  
  updateList() {
    store.get(STORAGE.UPCOMING_EVENTS).then((events) => {
        if(events && events.length != this.events.length) {
	    this.updateDataSource(events);
        }
    })
    .done();
  }

  updateDataSource(events) {
      this.events = events;
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(events),
          isLoading: false
      });
  }

  fetchData() {
       fetch(upcomingEventsPath)
       .then((response) => response.json())
       .then((responseData) => {
	   var success = responseData[PARAMs.SUCCESS];
	   if(success) {
	       var events = responseData[PARAMs.EVENTS];
	       if (events) {
	           store.save(STORAGE.UPCOMING_EVENTS, events).then(() => {
	               this.updateDataSource(events);
	           })
	           .done();
	           }
	   } else {
	       var errMsg = responseData[PARAMs.ERRORMSG];
               AlertIOS.alert( 'There was an error downloading the upcoming events.', errMsg);
	   }
       })
       .done();
   }

  render() {
    if (this.state.isLoading) {
        return this.renderLoadingView();
    }
    return (
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderEvent.bind(this)}
            style={styles.listView}
            />
    );
  }
  renderLoadingView() {
    return (
        <View style={styles.loading}>
            <ActivityIndicatorIOS
                size='large'/>
            <Text>
                Loading events...
            </Text>
        </View>
    );
  }

  showEventDetail(event) {
       this.props.navigator.push({
           title: event.host_name,
           component: <EventDetail displayAcceptBtns={true} event={event}/>,
       });
   } 
 
  renderEvent(event) {
       return (
            <TouchableHighlight onPress={() => this.showEventDetail(event)}  underlayColor='#dddddd'>
                <View>
                    <View style={styles.container}>
                        <Image
			    source={{uri: event.pic_url}}
                            style={styles.thumbnail} />
                        <View style={styles.rightContainer}>
                            <Text style={styles.title}>{event.host_name}</Text>
                            <Text style={styles.author}>{event.event_time}</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                </View>
            </TouchableHighlight>
       );
   }
}

module.exports = TabOne;

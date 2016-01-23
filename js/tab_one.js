'use strict';

import React from 'react-native';

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

var domain = "http://" + APIs.DOMAIN + ":" + APIs.PORT;
var UPCOMING_EVENTS_API = domain + APIs.GET_UPCOMING_EVENTS;

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
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
       fetch(UPCOMING_EVENTS_API)
       .then((response) => response.json())
       .then((responseData) => {
           this.setState({
               dataSource: this.state.dataSource.cloneWithRows(responseData),
               isLoading: false
           });
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
  
  renderEvent(event) {
       return (
            <TouchableHighlight>
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

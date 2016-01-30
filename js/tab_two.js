//'use strict';

import React from 'react-native';

var Calendar = require('react-native-calendar');
var GLOBALs = require('./constants/globals.js');
var PARAMs = require('./constants/constants_params.js');
var APIs = require('./constants/constants_api.js');
var moment = require('moment');
var EventDetail = require('./event_detail.js');
var store = require('react-native-simple-store');
var STORAGE = require('./constants/constants_storage.js');

const {
  Alert,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AlertIOS
} = React;

var userId = 1;
var params = {};
params[PARAMs.USERID] = userId;
var upcomingEventsPath = GLOBALs.createUrl(APIs.GET_MY_UPCOMING_EVENTS, params);

var customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f7f7f7',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class TabTwo extends Component {
  constructor(props) {
    super(props);

    //binding function
    var date = moment().format();
    this.render = this.render.bind(this);
    this.eventDates = [];
    this.events = [];
  }
  viewEvent(date) {
    var event = this.findDateInEvents(date);
    this.props.navigator.push({
        title: event.host_name,
        component: <EventDetail displayAcceptBtns={false} event={event}/>,
    });
  }
  cancelEvent(date) {
    var event = this.findDateInEvents(date);
    var userId = 1;
    var eventId = event.id;
    var params = {};
    params[PARAMs.USERID] = userId;
    params[PARAMs.EVENTID] = eventId;
    var cancelEventPath = GLOBALs.createUrl(APIs.CANCEL_EVENT, params);

    store.get(STORAGE.UPCOMING_EVENTS).then((upcomingEvents) => {
        upcomingEvents.push(event);
        store.save(STORAGE.UPCOMING_EVENTS, upcomingEvents).done();
    })
    .done();

    fetch(cancelEventPath)
       .then((response) => response.json())
       .then((responseData) => {
           var success = responseData[PARAMs.SUCCESS];
           if(success) {
               AlertIOS.alert('Event was successfully cancelled');

               var newEvents = [];
	       var newEvent;
               for (var i = 0; i < this.events; i++) {
                   var event = this.events[i];
                   if (event.id != eventId) {
                       newEvents.push(event);
                   } else {
                       newEvent = event;
                   }
               }
               this.events = newEvents;

               var newEventDates = [];
               for (var i = 0; i < this.events.length; i++) {
                   var e = this.events[i];
                   var eDate = e.event_time;
                   var indexOfSpace = eDate.indexOf("T");
                   var eDateFormat = eDate.substring(0, indexOfSpace);
                   if(eDateFormat != date) {
                       newEventDates.push(eDateFormat);
                   }
               }
               this.eventDates = newEventDates;
               this.forceUpdate();
           } else {
               var errMsg = responseData[PARAMs.ERRORMSG];
               AlertIOS.alert( 'There was an error downloading the upcoming events.', errMsg);
           }
       })
       .done();
  }
  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
      this.refreshView();
  }

  refreshView() {
      store.get(STORAGE.MY_EVENTS).then((myEvents) => {
if(myEvents) {
console.log("my = " + myEvents.length);
console.log("this = " + this.events.length);
}
          if (myEvents && myEvents.length != this.events.length) {
console.log("refresh 2");
              this.events = myEvents;
              this.updateDates();
          }
      })
      .done(); 
  }
  findDateInEvents(date){
    for (var i = 0; i < this.events.length; i++) {
        var e = this.events[i];
        var eDate = e.event_time;
        var indexOfSpace = eDate.indexOf("T");
        var eDateFormat = eDate.substring(0, indexOfSpace);
        if (date == eDateFormat) {
            return e;
        }
    }
    return null;
  }

  updateDates() {
  	var dates = [];
        for (var i = 0; i < this.events.length; i++) {
            var e = this.events[i];
            var eDate = e.event_time;
            var indexOfSpace = eDate.indexOf("T");
            var eDateFormat = eDate.substring(0, indexOfSpace);
            dates.push(eDateFormat);
         }
         this.eventDates = dates;
         this.forceUpdate();
  }

  fetchData() {
       fetch(upcomingEventsPath)
       .then((response) => response.json())
       .then((responseData) => {
           var success = responseData[PARAMs.SUCCESS];
           if(success) {
               this.events = responseData[PARAMs.EVENTS];
               if(this.events && this.events > 0) {
	           store.save(STORAGE.MY_EVENTS, this.events).done();
               }

	       this.updateDates();
           } else {
               var errMsg = responseData[PARAMs.ERRORMSG];
               AlertIOS.alert( 'There was an error downloading the upcoming events.', errMsg);
           }
       })
       .done();
   }
  setDate(date) {
    var indexOfT = date.indexOf("T");
    var dateFormat = date.substring(0, indexOfT);

    for (var i = 0; i < this.eventDates.length; i++) {
        var d = this.eventDates[i];
        if (d == dateFormat) {
	    Alert.alert( 'Upcoming Event!', 'You have an upcoming event, do you want to cancel it?', [ {text: 'OK', onPress: () => console.log("OK pressed")}, {text: 'View', onPress: () => this.viewEvent(d)}, {text: 'Cancel Event', onPress: () => this.cancelEvent(d), style:'cancel'}, ] )
        }
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Calendar
          ref="calendar"
          eventDates={this.eventDates}
          scrollEnabled={true}
          showControls={true}
          dayHeadings={customDayHeadings}
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={(date) => this.setDate(date)}
	/>
      </View>

    );
  }
}
module.exports = TabTwo;

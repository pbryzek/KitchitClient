'use strict';
 
var React = require('react-native');
var Button = require('react-native-button');

var APIs = require('./constants/constants_api.js');
var PARAMs = require('./constants/constants_params.js');
var GLOBALs = require('./constants/globals.js');
var MapView = require('react-native-maps');
var store = require('react-native-simple-store');
var STORAGE = require('./constants/constants_storage.js');

const {
    LinkingIOS,
    StyleSheet,
    AlertIOS,
    Text,
    View,
    Component,
    Image
} = React;

var styles = StyleSheet.create({
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
	height: 100,
    },
    container: {
        marginTop: 10,
        alignItems: 'center'
    },
    rowContainer: {
	flexDirection:'row' 
    },
    image: {
        width: 107,
        height: 165,
        padding: 10
    },
    directions: {
	marginTop: 110,
        fontSize: 15,
	textAlign: 'center',
        color: '#0645AD'
    },
    description: {
        padding: 10,
        fontSize: 15,
        color: '#656565'
    }
});
 
class EventDetail extends Component {
    addEventToMyEvents(eventId) {
        store.get(STORAGE.UPCOMING_EVENTS).then((upComingEvents) => {
            store.get(STORAGE.MY_EVENTS).then((myEvents) => {
		var myNewEvents = [];
                for (var i = 0; i < myEvents.length; i++) {
                    var myEvent = myEvents[i];
		    //Since the event was cancelled, add it back to upcoming events.
                    if (myEvent.id == eventId) {
                        upComingEvents.push(myEvent);
                    } else {
		        myNewEvents.push(event);
		    }
                }
		store.save(STORAGE.UPCOMING_EVENTS, upComingEvents).done();
		store.save(STORAGE.MY_EVENTS, myEvents).done();
            })
            .done();
        })
        .done();
    }
    removeEventFromStorage(eventId, alertMsg) {
        store.get(STORAGE.UPCOMING_EVENTS).then((events) => {
            var newEvents = [];
	    for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (event.id != eventId) {
                    newEvents.push(event);
                }
            }
            store.save(STORAGE.UPCOMING_EVENTS, newEvents).then(() => {
	        AlertIOS.alert(alertMsg);
	        this.props.navigator.pop();
            })
            .done();
        })
        .done();
    }
    acceptPress() {
	var event = this.props.event;
	var eventId = event.id;

	//TODO get the userId correctly
	var userId = 1;

	var params = {};
        params[PARAMs.USERID] = userId;
	params[PARAMs.EVENTID] = eventId;

	var acceptPath = GLOBALs.createUrl(APIs.ACCEPT_EVENT, params);

	fetch(acceptPath)
        .then((response) => response.json())
        .then((responseData) => {
		var success = responseData[PARAMs.SUCCESS];
		if(success) {
			this.removeEventFromStorage(eventId, 'You successfully accepted this event.');
		} else {
			var errMsg = responseData[PARAMs.ERRORMSG];
			AlertIOS.alert( 'There was an error accepting this event.', errMsg);
		}
        })
	.catch((error) => {
                console.warn(error);
        });
    }
    getDirections() {
	var event = this.props.event;
	var lat = event.host_latitude;
	var long = event.host_longitude;
	var url = 'http://maps.apple.com/?ll=' + lat + ',' + long;
	LinkingIOS.openURL(url);
    }
    checkinPress() {
        var event = this.props.event;
        var eventId = event.id;

        //TODO get the userId correctly
        var userId = 1;
        var params = {};
        var latitude = 37.7833;
        var longitude = -122.4167;
        params[PARAMs.USERID] = userId;
        params[PARAMs.EVENTID] = eventId;
	params[PARAMs.LATITUDE] = latitude;
        params[PARAMs.LONGITUDE] = longitude;

        var checkinPath = GLOBALs.createUrl(APIs.CHECKIN_USER, params);
        fetch(checkinPath)
        .then((response) => response.json())
        .then((responseData) => {
                var success = responseData[PARAMs.SUCCESS];
                if(success) {
                        AlertIOS.alert( 'You successfully checked into this event.', '');
                        this.props.navigator.pop();
                } else {
                        var errMsg = responseData[PARAMs.ERRORMSG];
			if (errMsg.indexOf('duplicate key value violates unique constraint') != -1) {
				AlertIOS.alert('You are already checked into this event.');
			} else {
                        	AlertIOS.alert( 'There was an error checking into this event.', errMsg);
			}
                }
        })
        .catch((error) => {
                console.warn(error);
        });
    }
    cancelPress() {
        var event = this.props.event;
        var eventId = event.id;

        //TODO get the userId correctly
        var userId = 1;

        var params = {};
        params[PARAMs.USERID] = userId;
        params[PARAMs.EVENTID] = eventId;

        var cancelEventPath = GLOBALs.createUrl(APIs.CANCEL_EVENT, params);
    
        fetch(cancelEventPath)
       .then((response) => response.json())
       .then((responseData) => {
           var success = responseData[PARAMs.SUCCESS];
           if(success) {
	       AlertIOS.alert('Event was successfully cancelled');
	       this.addEventToMyEvents(eventId);
           } else {
               var errMsg = responseData[PARAMs.ERRORMSG];
               AlertIOS.alert( 'There was an error canceling this event.', errMsg);
           }
       })
       .done();
    }
    declinePress() {
	var event = this.props.event;
        var eventId = event.id;

        //TODO get the userId correctly
        var userId = 1;

        var params = {};
        params[PARAMs.USERID] = userId;
        params[PARAMs.EVENTID] = eventId;

        var declinePath = GLOBALs.createUrl(APIs.DECLINE_EVENT, params);
	fetch(declinePath)
  	.then((response) => response.json())
  	.then((responseData) => {
		var success = responseData[PARAMs.SUCCESS];
                if(success) {
			this.removeEventFromStorage(eventId, 'You successfully declined this event.');
                } else {
                        var errMsg = responseData[PARAMs.ERRORMSG];
                        AlertIOS.alert( 'There was an error declining this event.', errMsg);
                }
  	})
  	.catch((error) => {
    		console.warn(error);
  	});
    }
    render() {
        var event = this.props.event;
	var initialRegion = {latitude: event.host_latitude,
      		longitude: event.host_longitude,
      		latitudeDelta: 0.01,
      		longitudeDelta: 0.01,
    	};
	var markers = [{
    	    latitude: event.host_latitude,
    	    longitude: event.host_longitude,
    	    title: event.host_name,
    	    subtitle: ''
  	}
	];

	this.event = event;
        var imageURI = (typeof event.pic_url !== 'undefined') ? event.pic_url : '';
        var description = (typeof event.host_name !== 'undefined') ? event.host_name : '';
	var displayAcceptButtons = true;
        
        var acceptBtn;
	var rejectBtn;
	var checkinBtn;
        var cancelBtn;
        if (this.props.displayAcceptBtns) {
            acceptBtn = <Button style={{fontSize: 20, color: 'green', marginRight:10}} onPress={this.acceptPress.bind(this)}>Accept</Button>;
            rejectBtn = <Button style={{fontSize: 20, color: 'red'}} onPress={this.declinePress.bind(this)}>Reject</Button>;
        } else {
	    cancelBtn = <Button style={{fontSize: 20, color: 'red'}} onPress={this.cancelPress.bind(this)}>Cancel Event</Button>;
            checkinBtn = <Button style={{fontSize: 20, color: 'green', marginRight:10}} onPress={this.checkinPress.bind(this)}>Checkin</Button>; 
        }

        return (
	<View>
	    <MapView
		annotations={markers}
                style={styles.map}
                initialRegion={initialRegion}
            />

	    <Text style={styles.directions}
		  onPress={this.getDirections.bind(this)}
		  >Directions</Text>

            <View style={styles.container}>
                <Image style={styles.image} source={{uri: imageURI}} />
		<View style={styles.rowContainer}>
                	<Text style={styles.description}>{description}</Text>
			<Text style={styles.description}>{event.event_time}</Text>
		</View>
		<View style={styles.rowContainer}>
		{acceptBtn}
		{rejectBtn}
		{checkinBtn}
		{cancelBtn}
		</View>
	    </View>
	   </View>
        );
    }
}
 
module.exports = EventDetail;

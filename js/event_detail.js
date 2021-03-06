'use strict';
 
var React = require('react-native');
var Button = require('react-native-button');

var APIs = require('./constants/constants_api.js');
var PARAMs = require('./constants/constants_params.js');
var GLOBALs = require('./constants/globals.js');
var MapView = require('react-native-maps');
var store = require('react-native-simple-store');
var STORAGE = require('./constants/constants_storage.js');
var RNGeocoder = require('react-native-geocoder');

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
        padding: 10,
        alignItems: 'center'
    },
    address : {
        marginTop: 110,
        fontSize: 15,
        textAlign: 'center',
    },
    directions: {
	marginTop: 10,
        fontSize: 15,
	textAlign: 'center',
        color: '#0645AD'
    },
    description: {
        padding: 10,
        fontSize: 15,
        color: '#656565',
        textAlign: 'center'
    },
    title : {
        padding: 10,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
 
class EventDetail extends Component {
    constructor(props) {
        super(props);

        var event = this.props.event;
        this.address = '';
        var location = {
            latitude: event.host_latitude,
            longitude: event.host_longitude
        };
        RNGeocoder.reverseGeocodeLocation(location, (err, data) => {
            if (err) {
                return;
            }
            var location = data[0];
            var postal = location["postalCode"];
            var state = location["administrativeArea"];
            var street = location["thoroughfare"];
            var streetNum = location["subThoroughfare"];
            var city = location["locality"];

            var address = streetNum + " "  + street + ", " + city + ", " + state + " " + postal;
            this.address = address;
            this.forceUpdate();
        });
    }
    cancelEvent(eventId) {
        store.get(STORAGE.UPCOMING_EVENTS).then((upComingEvents) => {
            store.get(STORAGE.MY_EVENTS).then((myEvents) => {
		var myNewEvents = [];
                for (var i = 0; i < myEvents.length; i++) {
                    var myEvent = myEvents[i];
		    //Since the event was cancelled, add it back to upcoming events.
                    if (myEvent.id == eventId) {
                        upComingEvents.push(myEvent);
                    } else {
		        myNewEvents.push(myEvent);
		    }
                }
		store.save(STORAGE.UPCOMING_EVENTS, upComingEvents).done();
		store.save(STORAGE.MY_EVENTS, myNewEvents).done();
            })
            .done();
        })
        .done();
    }
    addEventToMyEventsStorage(addEvent) {
        var eventId = addEvent.id;
        store.get(STORAGE.MY_EVENTS).then((events) => {
            if(events && events.length > 0) {
		events.push(addEvent);
                store.save(STORAGE.MY_EVENTS, events).done();
            } else {
                var eventsArr = [];
                eventsArr.push(addEvent);
                store.save(STORAGE.MY_EVENTS, eventsArr).done();
            }
        }).done();
    }
    removeEventFromUpcomingStorage(removeEvent) {
        var eventId = removeEvent.id;
        store.get(STORAGE.UPCOMING_EVENTS).then((events) => {
	    var newEvents = [];
	    var eventsLength = events.length;
	    if (events && eventsLength > 0) {
	    for (var i = 0; i < eventsLength; i++) {
                var event = events[i];
                if (event.id != eventId) {
                    newEvents.push(event);
                }
            }
	    } 
            store.save(STORAGE.UPCOMING_EVENTS, newEvents).done();
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
			AlertIOS.alert('You successfully accepted this event.');
			this.addEventToMyEventsStorage(event);
			this.removeEventFromUpcomingStorage(event);
			this.props.navigator.pop();
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
	       this.cancelEvent(eventId);
               this.props.navigator.pop();
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
			AlertIOS.alert('You successfully declined this event.');
			this.removeEventFromUpcomingStorage(event);
			this.props.navigator.pop();
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
    	    subtitle: 'Test'
  	}
	];

	this.event = event;
        var imageURI = (typeof event.pic_url !== 'undefined') ? event.pic_url : '';
        var hostName = (typeof event.host_name !== 'undefined') ? event.host_name : '';
	var displayAcceptButtons = true;
        
        var acceptBtn;
	var rejectBtn;
	var checkinBtn;
        var cancelBtn;
        if (this.props.displayAcceptBtns) {
            acceptBtn = <Button style={{fontSize: 20, color: 'green', marginRight:10}} onPress={this.acceptPress.bind(this)}>Accept</Button>;
            rejectBtn = <Button style={{fontSize: 20, color: 'red'}} onPress={this.declinePress.bind(this)}>Decline</Button>;
        } else {
	    cancelBtn = <Button style={{fontSize: 20, color: 'red'}} onPress={this.cancelPress.bind(this)}>Cancel Event</Button>;
            checkinBtn = <Button style={{fontSize: 20, color: 'green', marginRight:10}} onPress={this.checkinPress.bind(this)}>Checkin</Button>; 
        }

        var eventTime = GLOBALs.trimTime(event.event_time);

        return (
	<View>
	    <MapView
		annotations={markers}
                style={styles.map}
                initialRegion={initialRegion}
            />

            <Text style={styles.address}
                  >{this.address}</Text>

	    <Text style={styles.directions}
		  onPress={this.getDirections.bind(this)}
		  >Directions</Text>

	    <View style={styles.container}>
                <Image style={styles.image} source={{uri: imageURI}} />
 	    </View>
	    <View style={styles.rowContainer}>
		<Text style={styles.title}>Host Name: </Text>
                <Text style={styles.description}>{hostName}</Text>
	    </View>
            <View style={styles.rowContainer}>
	        <Text style={styles.title}>Host Time:</Text>
	        <Text style={styles.description}>{eventTime}</Text>
	    </View>
	    <View style={styles.container}>
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

'use strict';
 
var React = require('react-native');
var Button = require('react-native-button');

var APIs = require('./constants/constants_api.js');
var PARAMs = require('./constants/constants_params.js');
var GLOBALs = require('./constants/globals.js');
var MapView = require('react-native-maps');

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
			AlertIOS.alert( 'You successfully accepted this event.', '');
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
	console.log("lat = " + lat);
	var url = 'http://maps.apple.com/?ll=' + lat + ',' + long;
	LinkingIOS.openURL(url);

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
                        AlertIOS.alert( 'You successfully declined this event.', '');
                } else {
                        var errMsg = responseData[PARAMs.ERRORMSG];
                        AlertIOS.alert( 'There was an error declining this event.', errMsg);
                }

		this.props.navigator.pop();
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
                <Text style={styles.description}>{description}</Text>
		<View style={styles.rowContainer}>

	        <Button
        	    style={{fontSize: 20, color: 'green', marginRight:10}}
        	    onPress={this.acceptPress.bind(this)}
                >Accept</Button>
		<Button
                    style={{fontSize: 20, color: 'red'}}
                    onPress={this.declinePress.bind(this)}
                >Reject</Button>
		</View>
	    </View>
	   </View>
        );
    }
}
 
module.exports = EventDetail;

'use strict';
 
var React = require('react-native');
var Button = require('react-native-button');

var APIs = require('./constants/constants_api.js');
var PARAMs = require('./constants/constants_params.js');
var GLOBALs = require('./constants/globals.js');

const {
    StyleSheet,
    AlertIOS,
    Text,
    View,
    Component,
    Image
} = React;

var styles = StyleSheet.create({
    container: {
        marginTop: 75,
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
    description: {
        padding: 10,
        fontSize: 15,
        color: '#656565'
    }
});
 
class EventDetail extends Component {
    acceptPress(event) {
	var event = this.props.event;
	var eventId = event.id;

	//TODO get the userId correctly
	var userId = 1;

	var params = {};
        params[PARAMs.USERID] = userId;
	params[PARAMs.EVENTID] = eventId;

	var acceptPath = GLOBALs.createUrl(APIs.ACCEPT_EVENT, params);

	console.log(acceptPath);
	fetch(acceptPath)
        .then((response) => response.json())
        .then((responseData) => {
		AlertIOS.alert( 'You successfully accepted this event.', '');
        })
	.catch((error) => {
                console.warn(error);
        });
    }
    declinePress(event) {
	var event = this.props.event;
        var eventId = event.id;

        //TODO get the userId correctly
        var userId = 1;

        var params = {};
        params[PARAMs.USERID] = userId;
        params[PARAMs.EVENTID] = eventId;

        var declinePath = GLOBALs.createUrl(APIs.DECLINE_EVENT, params);
 	console.log(declinePath);
	fetch(declinePath)
  	.then((response) => response.json())
  	.then((responseData) => {
		AlertIOS.alert( 'You successfully declined this event.', '');
    		console.log(responseData);
  	})
  	.catch((error) => {
    		console.warn(error);
  	});
    }
    render() {
        var event = this.props.event;
	this.event = event;
        var imageURI = (typeof event.pic_url !== 'undefined') ? event.pic_url : '';
        var description = (typeof event.host_name !== 'undefined') ? event.host_name : '';
        return (
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
        );
    }
}
 
module.exports = EventDetail;

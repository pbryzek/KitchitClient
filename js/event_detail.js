'use strict';
 
var React = require('react-native');

const {
    StyleSheet,
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
    render() {
        var event = this.props.event;
if(event) {
console.log("event is ");
}
        var imageURI = (typeof event.pic_url !== 'undefined') ? event.pic_url : '';
        var description = (typeof event.host_name !== 'undefined') ? event.host_name : '';
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={{uri: imageURI}} />
                <Text style={styles.description}>{description}</Text>
            </View>
        );
    }
}
 
module.exports = EventDetail;

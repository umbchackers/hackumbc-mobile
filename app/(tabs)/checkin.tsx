import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const windowWidth = Dimensions.get('window').width;

export default function checkin(){

    return(
        <View style={styles.outerContainer}>
            <LinearGradient
                // Background Linear Gradient
                colors={['#94D2BD', '#E9D8A6', '#EE9B00']}
                start={{ x: 0, y: 0 }} //top left
                end={{ x: 1, y: 1 }} // bottom right
                style={styles.outerGradient}
                
            />
            <View style={styles.qrcontainer}>
                <LinearGradient
                    //qr container gradient
                    colors={['#d7ffed', '#e9c58a']}
                    start={{ x: 0, y: 0 }} //top left
                    end={{ x: 1, y: 1 }} // bottom right
                    // locations={[0.1, 0.9]}
                    style={styles.innerGradient}
                    
                />
                <Image source={require('../../assets/images/temp_qrcode.png')} style={styles.qrcode}/>
                <Text style={styles.text}>
                    Scan in. Gear up. Code on.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    qrcontainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.8, // 80% of screen width
        height: windowWidth, 
        margin: windowWidth * 0.1, // 10% margin on each side
        backgroundColor: 'transparent',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    innerGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0, 
        borderRadius: 20,
    },
    outerGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0, 
    },
    text:{
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#005F73',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    qrcode: {
        width: windowWidth * 0.7, // 70% of screen width
        height: windowWidth * 0.7, // Keep it square
    }
});
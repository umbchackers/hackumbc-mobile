import {View, Text, StyleSheet, Dimensions, ActivityIndicator, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';

const windowWidth = Dimensions.get('window').width;

export default function Checkin() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQrCode();
    }, []);

    const fetchQrCode = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Using placeholder image for now
            setQrCodeUrl(null);

            // Test S3 URL: need to input bucket and region
            // const testS3Url = 'https://<bucket>.s3.<region>.amazonaws.com/' + username?.replace('@', '_at_') + '.png';
            // setQrCodeUrl(testS3Url);
            
            // TODO: setup backend endpoint
            // const response = await api.get<{ qrCodeUrl: string }>('/qr-code', true);
            // setQrCodeUrl(response.qrCodeUrl);
            
        } catch (err) {
            console.error('Failed to fetch QR code:', err);
            setError('Failed to load QR code');
        } finally {
            setLoading(false);
        }
    };

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
                    style={styles.innerGradient}
                />
                
                {/*
                  Conditional rendering for QR code area:
                  1. If loading, show spinner and loading text
                  2. If error, show error message and retry option
                  3. Otherwise, show the QR code image (or placeholder)
                */}
                {loading ? (
                    // Show loading spinner while QR code is being fetched
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#005F73" />
                        <Text style={styles.loadingText}>Loading QR Code...</Text>
                    </View>
                ) : error ? (
                    // Show error message and retry button if there was an error
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <Text style={styles.retryText} onPress={fetchQrCode}>Tap to retry</Text>
                    </View>
                ) : (
                    // Show the QR code image (or placeholder if qrCodeUrl is null)
                    <Image
                        source={qrCodeUrl ? { uri: qrCodeUrl } : require('../../assets/images/temp_qrcode.png')}
                        style={styles.qrcode}
                        resizeMode="contain"
                        onError={() => {
                            setError('QR code image failed to load');
                        }}
                    />
                )}
                <Text style={styles.text}>
                    Scan in. Gear up. Code on.
                </Text>
            </View>
        </View>
    );
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
        borderColor: 'transparent',
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
    text: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#005F73',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    qrcode: {
        width: windowWidth * 0.7, // 70% of screen width
        height: windowWidth * 0.7, // Keep it square
    },
    loadingContainer: {
        width: windowWidth * 0.7,
        height: windowWidth * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#005F73',
        fontFamily: 'Poppins-Bold',
    },
    errorContainer: {
        width: windowWidth * 0.7,
        height: windowWidth * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    retryText: {
        marginTop: 10,
        fontSize: 14,
        color: '#005F73',
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-Bold',
    },
});
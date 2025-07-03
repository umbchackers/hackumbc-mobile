import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.replace('/');
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'challenge' in err) {
        if (err.challenge === 'NEW_PASSWORD_REQUIRED') {
          router.replace('/newpassword');
        }
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  <LinearGradient
    colors={['#D7FFED', '#E37302']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.background}
  >
    <LinearGradient
  colors={['rgba(215,255,237,0.47)', 'rgba(244,255,234,0.47)']}
  start={{ x: 0.07, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.card}
>
  <Image source={require('../assets/images/icon.png')} style={styles.logoIcon} />
      <Image source={require('../assets/images/hackumbc_logo.png')} style={styles.logoText} />
      <TextInput
        style={styles.input}
        placeholder="USERNAME"
        placeholderTextColor="#E37302"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#E37302"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
  <View style={styles.loginTextContainer}>
    {/* Red flower: bottom left, overlap the "L" */}
    <Image source={require('../assets/images/red_flower.png')} style={styles.flowerLeft} />
    {/* Login text, center */}
    <Text style={styles.loginText}>{loading ? 'Login' : 'Login'}</Text>
    {/* Yellow flower: top right, overlap the "n"/star */}
    <Image source={require('../assets/images/yellow_flower.png')} style={styles.flowerRight} />
  </View>
</TouchableOpacity>

    </LinearGradient>
  </LinearGradient>
  </TouchableWithoutFeedback>
);

}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E37302',
  },
   card: {
  width: 333,
  height: 521,
  borderRadius: 39,
  alignItems: 'center',
  paddingVertical: 20,
  paddingHorizontal: 16,
  justifyContent: 'flex-start', // fix!
},
logoIcon: {
  width: 155,
  height: 155,
  padding: 0,
  resizeMode: 'contain',
  marginBottom: -50, // reducing gap
},
logoText: {
  width: 226,
  height: 120,
  resizeMode: 'contain',
  //marginTop: -15, // negative pulls text closer to logo?
  marginBottom: 20,
},

  input: {
  width: 249,
  height: 44,
  borderWidth: 1,           // 1px border
  borderColor: '#E37302',   
  backgroundColor: '#EAFFEB', 
  borderRadius: 13,         
  paddingHorizontal: 12,
  fontFamily: 'LilitaOne',  
  fontSize: 14,
  color: '#E37302',        
  marginVertical: 10,
  textAlign: 'left',        
  fontWeight: '400',      
},

  loginButton: {
  width: 120,
  height: 42,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginTop: 24,
  backgroundColor: 'transparent', // Let the flowers/text overlap cleanly
  borderWidth: 0, // No border on button, just on text if needed
},

loginTextContainer: {
  width: 101, // per your Figma
  height: 42,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},

loginText: {
  fontFamily: 'Lemon',
  fontSize: 32,
  color: '#0C6366',
  textShadowColor: '#EAFFF6',
  textShadowOffset: { width: 3, height: 3 },
  textShadowRadius: 1,
  zIndex: 2, // Text is above the left flower, below the right one if needed
},

flowerLeft: {
  position: 'absolute',
  left: -14,
  bottom: 0,
  width: 19,
  height: 19,
  resizeMode: 'contain',
  zIndex: 1,
},
flowerRight: {
  position: 'absolute',
  right: -25,
  top: 3,
  width: 29,
  height: 29,
  resizeMode: 'contain',
  zIndex: 3,
},

  error: {
    color: 'red',
    marginTop: 10,
  },
});
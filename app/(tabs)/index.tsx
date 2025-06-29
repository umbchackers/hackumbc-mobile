import React from 'react';
import { SafeAreaView, StyleSheet, Image, View } from 'react-native';
import BottomNav from '@/components/BottomNav';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#c7efe6', '#f18e21']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View style={styles.topRow}>
          <Image
            source={require('../../assets/images/hackumbcdog2025.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/images/hacklogo2025.png')}
            style={styles.wordmark}
            resizeMode="contain"
          />
        </View>
        <BottomNav />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  wordmark: {
    width: 220,
    height: 80,
    marginLeft: 8,
  },
});
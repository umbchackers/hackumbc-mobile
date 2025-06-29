import React from 'react';
import { SafeAreaView, StyleSheet, Image, View } from 'react-native';
import BottomNav from '@/components/BottomNav';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5b2b2' }}>
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
import React from 'react';
import { StyleSheet, Image, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const openWebsite = () => {
    Linking.openURL('https://hackumbc.tech');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* header, also unless u have a workaround for how view works i 
        have scrollview cuz u have to scroll on the page to view everything*/}
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

        {/* welcome section */}
        <View style={styles.section}>
          <View style={styles.flowerLeft}>
            <Image
              source={require('../../assets/images/flower-asset-3.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
          <View style={styles.cardWrap}>
            <LinearGradient
              colors={['#e8f9e5', '#f6f8e0', '#fef7e1']}
              style={styles.card}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>Welcome to hackUMBC 2025! 🚀</Text>
              <Text style={styles.welcomeText}>
                Get ready for an amazing weekend of innovation, collaboration, and coding! 
                This app is your gateway to everything hackUMBC.
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.flowerRight}>
            <Image
              source={require('../../assets/images/flower-asset-5.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* about us section */}
        <View style={styles.section}>
          <View style={styles.flowerLeftBottom}>
            <Image
              source={require('../../assets/images/flower-asset-5.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
          <View style={styles.cardWrap}>
            <LinearGradient
              colors={['#e8f9e5', '#f6f8e0', '#fef7e1']}
              style={styles.card}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>About hackUMBC</Text>
              <Text style={styles.bodyText}>
                hackUMBC is UMBC's only hackathon, bringing together students from all 
                backgrounds to create innovative solutions to real-world problems. Whether 
                you're a coding veteran or just starting your tech journey, there's a place 
                for you here!
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.flowerRightTop}>
            <Image
              source={require('../../assets/images/flower-asset-3.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* app features section */}
        <View style={styles.section}>
          <View style={styles.flowerLeft}>
            <Image
              source={require('../../assets/images/flower-asset-3.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
          <View style={styles.cardWrap}>
            <LinearGradient
              colors={['#e8f9e5', '#f6f8e0', '#fef7e1']}
              style={styles.card}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>What You Can Do</Text>
              <View style={styles.featureContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(236, 254, 255, 0.9)']}
                  style={styles.feature}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.featureIcon}>📱</Text>
                  <Text style={styles.featureTitle}>Check-In</Text>
                  <Text style={styles.featureText}>Get checked in by having an organzier scan your QR code</Text>
                </LinearGradient>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(236, 254, 255, 0.9)']}
                  style={styles.feature}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.featureIcon}>📅</Text>
                  <Text style={styles.featureTitle}>Schedule</Text>
                  <Text style={styles.featureText}>View all events, workshops, and activities</Text>
                </LinearGradient>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(236, 254, 255, 0.9)']}
                  style={styles.feature}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.featureIcon}>🔍</Text>
                  <Text style={styles.featureTitle}>Announcements</Text>
                  <Text style={styles.featureText}>View live announcements from the hackUMBC team</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.flowerRight}>
            <Image
              source={require('../../assets/images/flower-asset-5.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* announcements section */}
        <View style={styles.section}>
          <View style={styles.flowerLeftBottom}>
            <Image
              source={require('../../assets/images/flower-asset-5.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
          <View style={styles.cardWrap}>
            <LinearGradient
              colors={['#e8f9e5', '#f6f8e0', '#fef7e1']}
              style={styles.card}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>Latest Updates</Text>
              <View style={styles.announcementContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(236, 254, 255, 0.9)']}
                  style={styles.announcement}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.announcementTitle}>🎉 Registration Now Open!</Text>
                  <Text style={styles.announcementText}>
                    Sign up for hackUMBC 2025 is now live! Don't miss out on this incredible opportunity.
                  </Text>
                </LinearGradient>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(236, 254, 255, 0.9)']}
                  style={styles.announcement}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.announcementTitle}>🏆 Amazing Prizes Announced</Text>
                  <Text style={styles.announcementText}>
                    Check out the incredible prizes worth over $10,000 for this year's winners!
                  </Text>
                </LinearGradient>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(236, 254, 255, 0.9)']}
                  style={styles.announcement}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.announcementTitle}>📚 Workshop Schedule Released</Text>
                  <Text style={styles.announcementText}>
                    From AI/ML to web development, we've got workshops for every skill level.
                  </Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.flowerRightTop}>
            <Image
              source={require('../../assets/images/flower-asset-3.png')}
              style={styles.flower}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* website link */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.websiteButton} onPress={openWebsite}>
            <Text style={styles.websiteButtonText}>🌐 Visit Our Website!</Text>
            <Text style={styles.websiteButtonSubtext}>hackumbc.tech</Text>
          </TouchableOpacity>
        </View>

        {/* bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
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
  section: {
    marginBottom: 30,
    position: 'relative',
  },
  flowerLeft: {
    position: 'absolute',
    left: -10,
    top: 20,
    zIndex: 1,
  },
  flowerRight: {
    position: 'absolute',
    right: -10,
    bottom: 20,
    zIndex: 1,
  },
  flowerLeftBottom: {
    position: 'absolute',
    left: -10,
    bottom: 20,
    zIndex: 1,
  },
  flowerRightTop: {
    position: 'absolute',
    right: -10,
    top: 20,
    zIndex: 1,
  },
  flower: {
    width: 50,
    height: 50,
    opacity: 0.7,
  },
  cardWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4b46',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 24,
  },
  bodyText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  featureContainer: {
    gap: 16,
  },
  feature: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e95d2e',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#424747',
    textAlign: 'center',
    lineHeight: 20,
  },
  announcementContainer: {
    gap: 12,
  },
  announcement: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 6,
  },
  announcementText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  websiteButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  websiteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  websiteButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
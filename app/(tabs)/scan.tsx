import { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createApi } from '../../lib/api';
import Scanner from '@/components/Scanner';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const { idToken } = useAuth();
  const api = createApi(idToken);

  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    setLoading(true);
    setError(null);
    setUserInfo(null);
    try {
      const response = await api.post<{ body: string }>('/admin/users', { email }, false);
      setUserInfo(JSON.parse(response.body));
    } catch (err) {
      setError('User not found or error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const unpackPayload = (payload: string) => {
    setEmail(payload);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <View style={styles.innerContent}>
          <View style={styles.titleRow}>
            <Image source={require('../../assets/images/flower-asset-3.png')} style={styles.flowerImgLeft} />
            <Text style={styles.title}>QR CODE</Text>
            <Image source={require('../../assets/images/flower-asset-5.png')} style={styles.flowerImgRight} />
          </View>
          <View style={styles.card}>
            {/* user lookup UI */}
            <Text style={styles.lookupTitle}>Scan - Get User Info</Text>
            <TextInput
              placeholder="Enter user email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={styles.input}
            />
            <Button
              title={loading ? 'Looking up...' : 'Lookup User'}
              onPress={handleLookup}
              disabled={loading || email.length === 0}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            {userInfo && (
              <View style={styles.userInfo}>
                <Text style={styles.userText}>Name: {userInfo.full_name}</Text>
                <Text style={styles.userText}>Age: {userInfo.age}</Text>
                <Button title="Reset" onPress={() => { setUserInfo(null); setError(null); setEmail(''); }} color="#b71c1c" />
              </View>
            )}
            {/* sample image, replace later who cares */}
            <Image source={require('../../assets/images/icon.png')} style={styles.qrSample} />
            {/* scanner */}
            <Scanner onScanned={unpackPayload} />
            {/* tagline */}
            <Text style={styles.tagline}>Scan In. Gear Up. Code On.</Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  flowerImgLeft: {
    width: 32,
    height: 32,
    marginRight: 4,
    marginTop: -10,
  },
  flowerImgRight: {
    width: 32,
    height: 32,
    marginLeft: 4,
    marginTop: -10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00695c',
    letterSpacing: 2,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    // keep backgroundColor for card contrast
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    marginBottom: 20,
    padding: 20,
  },
  lookupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00695c',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  userInfo: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    marginBottom: 5,
  },
  qrSample: {
    width: 180,
    height: 180,
    marginVertical: 16,
    resizeMode: 'contain',
  },
  tagline: {
    marginTop: 24,
    fontSize: 22,
    color: '#00695c',
    fontWeight: '600',
    textAlign: 'center',
  },
});
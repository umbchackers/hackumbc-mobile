import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { role } = useAuth();
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Home Page</Text>
      {!role && <Button title="Go to Login" onPress={() => router.push('/login')} />}
    </View>
  );
}
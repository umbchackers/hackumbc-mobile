import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Home Page</Text>
      <Button title="Go to Login" onPress={() => router.push('/login')} />
    </View>
  );
}
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Login Page</Text>
      <Button title="Simulate Admin Login" onPress={() => {
        login('admin');
        router.replace('/');
      }} />
    </View>
  );
}
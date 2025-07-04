import { Pressable, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

export default function LogoutButton() {
  const { loggedIn, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();


  // hide this on login (obvs)
  if (
    pathname === '/login' || pathname === 'login' ||
    pathname === '/newpassword' || pathname === 'newpassword'
  ) return null;

  const handlePress = async () => {
    if (loggedIn) {
      await logout();
      router.replace('/login');
    } else {
      router.replace('/login');
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.btn, { top: insets.top + 8 }]}
    >
      <Text style={styles.txt}>{loggedIn ? 'Logout' : 'Login'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
  },
  txt: { color: '#fff', fontWeight: '600' },
}); 
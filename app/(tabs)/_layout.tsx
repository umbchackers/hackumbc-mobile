import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'react-native';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { role, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  // determine active page
  let active: 'schedule' | 'home' | 'scan' = 'home';
  if (path === '/schedule') {
    active = 'schedule';
  } else if (path === '/scan') {
    active = 'scan';
  } else if (path === '/' || path === '' || path === '/home') {
    active = 'home';
  } else {
    active = 'home'; // fallback to home
  }

  return (
    <>
      {/* tabs */}
      <Tabs
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: { display: 'none' },
          contentStyle:{ backgroundColor: 'transparent' },
        })}
      >
        <Tabs.Screen
          name="index" 
          options={{
            title: 'Home',
            headerRight: () => role === 'admin' && <Button title="Logout" onPress={logout} />, 
          }} 
        />
        <Tabs.Screen
          name="schedule" 
          options={{
            title: 'Schedule',
            headerRight: () => role === 'admin' && <Button title="Logout" onPress={logout} />, 
          }} 
        />
        <Tabs.Screen
          name="scan" 
          options={{
            title: 'Scan',
            href: role === 'admin' ? '/scan' : null,
            headerRight: () => role === 'admin' && <Button title="Logout" onPress={logout} />, 
          }} 
        />
      </Tabs>
      
      {/* inline bottom navigation */}
      <View style={styles.container}>
        <Pressable onPress={() => router.replace('/schedule')} style={styles.btn}>
          <Feather name="calendar" size={28} color={active === 'schedule' ? '#b30000' : '#ff6b00'} />
          <Text style={[styles.label, active === 'schedule' && styles.labelActive]}>SCHEDULE</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/')} style={styles.btn}>
          <FontAwesome name="home" size={28} color={active === 'home' ? '#b30000' : '#ff6b00'} />
          <Text style={[styles.label, active === 'home' && styles.labelActive]}>HOME</Text>
        </Pressable>
        {role === 'admin' && (
          <Pressable onPress={() => router.replace('/scan')} style={styles.btn}>
            <MaterialCommunityIcons name="qrcode-scan" size={28} color={active === 'scan' ? '#b30000' : '#ff6b00'} />
            <Text style={[styles.label, active === 'scan' && styles.labelActive]}>QR CODE</Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff', // for navbar contrast
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  btn: { alignItems: 'center', marginHorizontal: 22 },
  label: { marginTop: 4, fontSize: 11, color: '#ff6b00', fontWeight: '600' },
  labelActive: { color: '#b30000', fontWeight: 'bold' },
});
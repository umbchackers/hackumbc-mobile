import { RelativePathString, Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { View, Text, Pressable, StyleSheet, BackHandler, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ReactElement, useState, cloneElement } from 'react';
import { validateRoles } from '@/lib/util';
import { UserRole } from '@/types';

interface NavItem {
  key: string,
  label: string,
  icon: ReactElement,
  route: string,
  allowedRoles?: string[]
}

export default function TabsLayout() {
  const { roles, loggedIn } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [active, setActive] = useState('home');

  const navItems: NavItem[] = [
    {
      key: 'home',
      label: 'HOME?',
      icon: <FontAwesome name="home" />,
      route: '/'
    },
    {
      key: 'schedule',
      label: 'SCHEDULE',
      icon: <Feather name="calendar" />,
      route: '/schedule'
    },
    {
      key: 'scan',
      label: 'SCAN',
      icon: <MaterialCommunityIcons name="qrcode-scan" />,
      route: '/scan',
      allowedRoles: ['admin']
    }
  ]

  const visibleNavItems = navItems.filter(item => {
    if (!item.allowedRoles) return true;
    if (!loggedIn || !roles) return false;
    return validateRoles(item.allowedRoles as UserRole[], roles);
  });

  const handleNavPress = (route: string, key: string) => {
    if (path === route) return; // avoid transition on clicking same page
    setActive(key);
    router.push(route as RelativePathString);
  }

  const Nav = () => {
    return (
      <View style={styles.container}>
        {visibleNavItems.map((item: NavItem) => {
          const isActive = active === item.key;
          const iconColor = isActive ? '#b30000' : '#ff6b00';
          const labelStyle = isActive ? styles.labelActive : styles.label;
          return (
            <Pressable
              key={item.key}
              onPress={() => handleNavPress(item.route, item.key)}
              style={styles.btn}
            >
              {cloneElement(item.icon as ReactElement<{color: string, size: number}>, { color: iconColor, size: 28 })}
              <Text style={[styles.label, labelStyle]}>{item.label}</Text>
            </Pressable>
          )
        })}
      </View>
    )
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="scan" />
      </Stack>
      <Nav />
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
import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StyleSheet, Dimensions } from 'react-native';

export default function TabsLayout() {
  const { role, logout } = useAuth();

  return (
    <Tabs
    screenOptions={{
      headerShown: true,
      headerTransparent: false,
      headerTitle: '',
      tabBarActiveTintColor: '#AD2115',
      tabBarInactiveTintColor: '#ED9C21',
      tabBarStyle: styles.tabBar,
    }}
    >
      <Tabs.Screen
        name="index" 
        options={{
            title: 'Home',
            headerRight: () => role === 'admin' && <Button title="Logout" onPress={logout} />,
            tabBarIcon : ({color}) => (<Feather name="home" size={24} color={color} /> )
        }} 
      />
      <Tabs.Screen
        name="schedule" 
        options={{
            title: 'Schedule',
            headerRight: () => role === 'admin' && <Button title="Logout" onPress={logout} />,
            tabBarIcon : ({color}) => (<Ionicons name="today" size={24} color={color} />)
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
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    width: 333,
    height: 76,
    marginHorizontal:  Dimensions.get('window').width / 2 - 333 / 2,
    borderRadius: 38,
    backgroundColor: 'white',
    shadowColor: '#AD2115',
    shadowOffset: { width: 15, height: 9 },
    shadowOpacity: 0.67,          // 67%
    shadowRadius: 42.3 / 2,       // React Native uses "radius", not "blur"
    elevation: 10,                // Android (approximate — tune visually)
    paddingTop: 10,
  },
});
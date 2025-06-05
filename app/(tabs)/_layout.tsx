import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'react-native';

export default function TabsLayout() {
  const { role, logout } = useAuth();

  return (
    <Tabs>
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
      <Tabs.Screen
          name="checkin" 
          options={{
              title: 'Check in',
              href: '/checkin',
              headerRight: () => role === 'admin' && <Button title="Logout" onPress={logout} />,
          }} 
        />

    </Tabs>
  );
}
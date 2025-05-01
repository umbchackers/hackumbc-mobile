// import { Tabs } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';

// export default function TabsLayout() {
//   const { role } = useAuth();

//   return (
//     <Tabs>
//       <Tabs.Screen name="index" options={{ title: 'Home' }} />
//       <Tabs.Screen name="schedule" options={{ title: 'Schedule' }} />
//       {/* {(role === 'admin' || true) && (
//         <Tabs.Screen
//           name="../(admin)/scan"
//           options={{ title: 'Scan' }}
//         />
//       )} */}
//       <Tabs.Screen name='../(admin)/scan' options={{ title: 'Scan' }} />
//     </Tabs>
//   );
// }

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

    </Tabs>
  );
}
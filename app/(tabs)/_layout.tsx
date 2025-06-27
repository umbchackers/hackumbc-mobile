import { RelativePathString, Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'react-native';
import { UserRole } from '@/types';
import { validateRoles } from '@/lib/util';

export default function TabsLayout() {
  const { roles, logout } = useAuth();

  const ScreenTab = ({ allowedRoles, tabInfo }: { allowedRoles: UserRole[] | null, tabInfo: { name: string, title: string, route?: string } }) => {
    if (allowedRoles !== null && tabInfo.route == null) return;
    return (
      <Tabs.Screen
        name={tabInfo.name}
        options={{
          title: tabInfo.title,
          href: allowedRoles !== null && validateRoles(allowedRoles, roles) ? tabInfo.route as RelativePathString : null,
          headerRight: () => roles !== null && <Button title="Logout" onPress={logout} />
        }}
      />
    );
  }

  return (
    <Tabs>
      <ScreenTab
        allowedRoles={null}
        tabInfo={{
          name: 'index',
          title: 'Home',
        }}
      />
      <ScreenTab
        allowedRoles={null}
        tabInfo={{
          name: 'schedule',
          title: 'Schedule'
        }}
      />
      <ScreenTab
        allowedRoles={['admin']}
        tabInfo={{
          name: 'scan',
          title: 'Scan',
          route: '/scan'
        }}
      />
      <ScreenTab
        allowedRoles={['admin', 'participant']}
        tabInfo={{
          name:'qrcode',
          title: 'QR Code',
          route: '/qrcode'
        }}
      />
    </Tabs>
  );
}
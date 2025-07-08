import { RelativePathString, Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from 'react-native';
import { UserRole } from '@/types';
import { validateRoles } from '@/lib/util';

interface TabConfig {
  name: string;
  title: string;
  allowedRoles?: UserRole[];
  showLogout?: boolean;
}

export default function TabsLayout() {
  const { roles, logout, loggedIn, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  const tabConfigs: TabConfig[] = [
    {
      name: 'index',
      title: 'Home',
      showLogout: true,
    },
    {
      name: 'schedule',
      title: 'Schedule',
    },
    {
      name: 'scan',
      title: 'Scan',
      allowedRoles: ['admin'],
    },
  ];

  const shouldShowTab = (tabConfig: TabConfig): boolean => {
    if (!tabConfig.allowedRoles) {
      return true;
    }

    if (!loggedIn || !roles) {
      return false;
    }

    return validateRoles(tabConfig.allowedRoles, roles);
  };

  const getTabHref = (tabConfig: TabConfig): string | null => {
    if (!shouldShowTab(tabConfig)) {
      return null;
    }
    
    return undefined as any;
  };

  return (
    <Tabs>
      {tabConfigs.map((tabConfig) => (
        <Tabs.Screen
          key={tabConfig.name}
          name={tabConfig.name}
          options={{
            title: tabConfig.title,
            href: getTabHref(tabConfig) as RelativePathString,
            headerRight: () => 
              loggedIn && tabConfig.showLogout ? (
                <Button title="Logout" onPress={logout} />
              ) : null,
          }}
        />
      ))}
    </Tabs>
  );
}
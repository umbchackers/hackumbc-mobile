// import { View, Text } from 'react-native';

// export default function ScanScreen() {
//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 24 }}>Admin Scan Screen</Text>
//     </View>
//   );
// }
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ScanScreen() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role !== 'admin') {
      router.replace('/');
    }
  }, [role]);

  if (role !== 'admin') return null;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Admin Scan Screen</Text>
    </View>
  );
}
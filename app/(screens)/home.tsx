import { useAuth } from '@/contexts/AuthContext';
import { View,Text,Button } from 'react-native';

export default function home() {
  const { user, userProfile, loading, signOut } = useAuth();
    
  return (
    <View>
      <Text>Welcome, {userProfile?.name}</Text>
      <Text>Phone: {userProfile?.contact}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
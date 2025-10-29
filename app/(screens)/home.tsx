import { useAuth } from '@/contexts/AuthContext';
import { Button, Text, View } from 'react-native';

export default function home() {
  const { user, loading, signOut } = useAuth();
    
  return (
    <View>
      <Text>Welcome, </Text>
      <Text>Phone: </Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
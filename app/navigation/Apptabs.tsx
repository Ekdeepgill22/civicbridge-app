import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import Home from '../screens/home';
import RegisterComplaint from '../screens/RegisterComplaint';
import ComplaintHistory from '../screens/ComplaintHistory';
import Profile from '../screens/profile';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (<Ionicons name="home-outline" size={24} color={color} />),}}
      />

      <Tab.Screen
        name="New Complaint"
        component={RegisterComplaint}
        options={{
          tabBarIcon: ({ color }) => (<Ionicons name="add-circle-outline" size={24} color={color} />),
        }}
      />

      <Tab.Screen
        name="History"
        component={ComplaintHistory}
        options={{
          tabBarIcon: ({ color }) => (<Ionicons name="documents-outline" size={24} color={color} />),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (<Ionicons name="person-outline" size={24} color={color} />),
        }}
      />
    </Tab.Navigator>
  );
}

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import TechnicianDashboard from '../screens/TechnicianDashboard';
import TechnicianProfile from '../screens/TechnicianProfile';
import TechnicianComplaintHistory from '../screens/Techniciancomplainthistory';

const Tab = createBottomTabNavigator();

export default function TechnicianTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={TechnicianDashboard}
        options={{
          tabBarIcon: ({ color }) => (<Ionicons name="briefcase-outline" size={24} color={color} />),
        }}
      />
      <Tab.Screen
        name="Complaints"
        component={TechnicianComplaintHistory}
        options={{
          tabBarIcon: ({ color }) => (<Ionicons name="documents-outline" size={24} color={color} />),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={TechnicianProfile}
        options={{
          tabBarIcon: ({ color }) => (<Ionicons name="person-outline" size={24} color={color} />),
        }}
      />
    </Tab.Navigator>
  );
}
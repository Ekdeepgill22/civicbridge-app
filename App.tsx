import AppNavigator from "./app/navigation/AppNavigator";
import { AuthProvider } from "./app/contexts/AuthContext";
import AppTabs from "./app/navigation/Apptabs";

export default function App() {
  return ( 
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
  );
}

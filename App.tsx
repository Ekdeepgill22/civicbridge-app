import AppNavigator from "./app/navigation/AppNavigator";
import { AuthProvider } from "./app/contexts/AuthContext";

export default function App() {
  return ( 
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
  );
}

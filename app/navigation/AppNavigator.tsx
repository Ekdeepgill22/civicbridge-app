import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";
import { AuthStackParamList } from "./types";

import OnboardingScreen from "../screens/index";
import LoginPage from "../screens/login";
import Verify from "../screens/Verify";
import LoginEmailPage from "../screens/loginEmail";
import EmailSignupPage from "../screens/signupemail";
import technicianLogin from "../screens/technicianlogin";

import AppTabs from "./Apptabs";
import TechnicianTabs from "./TechnicianTabs";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AppNavigator() {
  const { user, technicianProfile, authType, loading } = useAuth();
  if (loading) return null;

   const isAuthenticated =(authType === "user" && user) ||(authType === "technician" && technicianProfile);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {isAuthenticated ? (
          authType === 'user' ? (
          <Stack.Screen name="AppTabs" component={AppTabs} />
        ) : (
          <Stack.Screen name = "TechnicianTabs" component= {TechnicianTabs}/>
          )
        )  : (          
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Verify" component={Verify} />
            <Stack.Screen name="LoginEmail" component={LoginEmailPage} />
            <Stack.Screen name="EmailSignup" component={EmailSignupPage} />
            <Stack.Screen name="TechnicianLogin" component={technicianLogin} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

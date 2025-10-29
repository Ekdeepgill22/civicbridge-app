import { auth } from '@/constants/firebase';
import { FirebaseAuthTypes, onAuthStateChanged } from '@react-native-firebase/auth';
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  confirmation: FirebaseAuthTypes.ConfirmationResult | null;
  setConfirmation: (confirmation: FirebaseAuthTypes.ConfirmationResult | null) => void;
  loading: boolean;
  initializing: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  confirmation: null,
  setConfirmation: () => {},
  loading: false,
  initializing: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth ,(authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setConfirmation(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user,confirmation,setConfirmation,loading,initializing,signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if(context === undefined){
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { User } from "@/modals/user";
import { useRouter, useSegments } from "expo-router";
import { ConfirmationResult, User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile : User | null;
  confirmation: ConfirmationResult | any;
  setConfirmation: (confirmation: ConfirmationResult | null) => void;
  loading: boolean;
  signOut: ()=> Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ user,setUser ] = useState<FirebaseUser | null>(null);
  const [ userProfile,setUserProfile ] = useState<User | null>(null);
  const [ confirmation,setConfirmation ] =  useState<ConfirmationResult | null>(null);
  const [ loading,setLoading ] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser)=>{
      setUser(firebaseUser);

      if(firebaseUser){
        try{
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.phoneNumber?.slice(3) || ''));
          if(userDoc.exists()){
            setUserProfile(userDoc.data() as User);
          }
        }catch(err){
          console.error('Error fetching user profile', err);
        }
      }else{
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

// Route Protection and keeping signed in
  useEffect(() => {
    if(loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if(!user && !inAuthGroup){
      router.replace('/');
    }else if(user && inAuthGroup){
      router.replace('/(screens)/home');
    }
  }, [user, segments, loading]);

  const signOut = async() =>{
    try{
      await auth.signOut();
      setUser(null);
      setUserProfile(null);
      router.replace('/(auth)/login');
    }catch(err){
      console.error('Error while signing out: ', err)
      throw err
    };
  }

  return (
    <AuthContext.Provider value={{ user,userProfile,confirmation,setConfirmation,loading,signOut }}>
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

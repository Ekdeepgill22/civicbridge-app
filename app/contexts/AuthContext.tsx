import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from "../modals/user";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any | null;
  userProfile : User | null;
  confirmation: any;
  setConfirmation: (confirmation: any | null) => void;
  loading: boolean;
  signOut: ()=> Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ user,setUser ] = useState<any | null>(null);
  const [ userProfile,setUserProfile ] = useState<User | null>(null);
  const [ confirmation,setConfirmation ] =  useState<any | null>(null);
  const [ loading,setLoading ] = useState(true);

  useEffect(()=>{
    const unsubscribe = auth().onAuthStateChanged( async (firebaseUser)=>{
      setUser(firebaseUser);

      if(firebaseUser){
        try{
          const phone = firebaseUser.phoneNumber?.replace('+91', '');
          const email = firebaseUser.email;

          let userDoc = null;
          if(phone){
            const docsnap = await firestore().collection('users').where('contact', '==', phone).get();
            if(!docsnap.empty){
              userDoc = docsnap.docs[0];
            }
          }
          if(!userDoc && email){
            const emailSnap = await firestore().collection('users').where('email', '==', email).get();

            if(!emailSnap.empty){
              userDoc = emailSnap.docs[0];
            }
          }

          if(userDoc){
            setUserProfile(userDoc.data() as User);
          }else{
            setUserProfile(null);
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

  const signOut = async() =>{
    try{
      await auth().signOut();
      setUser(null);
      setUserProfile(null);
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

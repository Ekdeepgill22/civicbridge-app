import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from "../modals/user";
import React, { createContext, useContext, useEffect, useState } from "react";
import { technicians } from '../modals/technician';

type AuthType = 'user' | 'technician' | null;

interface AuthContextType {
  user: any | null;
  technician : any | null;
  userProfile : User | null;
  technicianProfile : technicians | null;
  authType: AuthType;
  confirmation: any;
  setConfirmation: (confirmation: any | null) => void;
  setAuthType: (type: AuthType) => void;
  setTechnicianProfile: (profile: technicians | null) => void;
  loading: boolean;
  signOut: ()=> Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ user,setUser ] = useState<any | null>(null);
  const [ technician, setTechnician] = useState<any | null>(null);
  const [ userProfile,setUserProfile ] = useState<User | null>(null);
  const [ technicianProfile, setTechnicianProfile] = useState<technicians | null>(null);
  const [ confirmation,setConfirmation ] =  useState<any | null>(null);
  const [ loading,setLoading ] = useState(true);
  const [ authType, setAuthType] = useState<AuthType>(null);

  useEffect(()=>{
    const unsubscribe = auth().onAuthStateChanged( async (firebaseUser)=>{
      if(authType==='technician'){
        setLoading(false);
      }
      if(!firebaseUser){
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        return;
      }
      if(authType === 'user'){
      setUser(firebaseUser);
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
        }finally{
          setLoading(false);
        }
      }else{
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [authType]);

  const signOut = async() =>{
    try{
      if(authType === 'user'){
          await auth().signOut();
        }
        setUser(null);
        setUserProfile(null);
        setTechnician(null);
        setTechnicianProfile(null);
        setAuthType(null);
    }catch(err){
      console.error('Error while signing out: ', err)
      throw err
    };
  }

  return (
    <AuthContext.Provider value={{ user,userProfile,technician,technicianProfile,authType,setAuthType,setTechnicianProfile,confirmation,setConfirmation,loading,signOut }}>
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

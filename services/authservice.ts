import { auth, firestore } from '@/constants/firebase';
import { User } from '@/modals/user';
import { signOut as firebaseSignOut, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from '@react-native-firebase/firestore';
// let recaptchaVerifier: RecaptchaVerifier | null = null;

// export const intializeRecaptcha = (containerId: string): RecaptchaVerifier =>{
//     if(!recaptchaVerifier){
//         recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
//             size: 'invisible',
//             callback: (response: any) =>{
//                 console.log('reCAPTCHA solved');
//             },
//             'expired-callback': ()=>{
//                 console.log('reCAPTCHA expired');
//                 recaptchaVerifier = null;
//             }
//         });
//     }
//     return recaptchaVerifier;
// };

// export const clearRecaptcha = () =>{
//     if(recaptchaVerifier){
//         recaptchaVerifier.clear();
//         recaptchaVerifier = null;
//     }
// }

export const UserExists = async(contact: string)=>{
    try{
        const formattedContact = contact.startsWith('+91') ? contact : `+91${contact}`;
        const userRef = collection(firestore, 'users');
        const q = query(userRef, where('contact', '==', formattedContact));
        const querySnap = await getDocs(q);
        return !querySnap.empty;
    }catch(err){
        console.log('Error checking user existence:', err);
        throw err;
    }
};

export const sendOtp = async(contact: string) => {
    try{
        const formattedContact = contact.startsWith('+') ? contact : `+91${contact}`;
        const confirmation = await signInWithPhoneNumber(auth, formattedContact);
        return confirmation
    }catch(err){
        console.error("OTP send error: ", err);
        throw err;
    }
};

export const verifyOtp = async(confirmation: any, otp: string) =>{
    try{
        const userCredential = await confirmation.confirm(otp);
        return userCredential.user;
    }catch(err){
        console.error("OTP verification failed: ",err);
        throw err;
    }
};

export const createUser = async(contact: string ,user: User)=>{
    try{
        const formattedContact = contact.startsWith('+91') ? contact : `+91${contact}`;
        const userRef = doc(firestore, 'users');
        await setDoc(userRef,{ ...user});
        console.log('User created successfully in Firestore');
    }catch(err){
        console.error('Error creating user:', err);
        throw err;
    }
    };

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  };
};
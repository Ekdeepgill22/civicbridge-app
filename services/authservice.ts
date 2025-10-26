import { auth, db } from '@/constants/firebase';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, getDoc, setDoc} from 'firebase/firestore';
import { User } from '@/modals/user';

export const UserExists = async(contact: string)=>{
    const userRef = doc(db, 'users', contact);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
};

export const sendOtp = async(contact: string) => {
    try{
        const confirmation = await signInWithPhoneNumber(auth, contact);
        return confirmation
    }catch(err){
        console.error("OTP send error: ", err);
        throw err;
    }
};

export const verifyOtp = async(confirmation: ConfirmationResult, otp: string) =>{
    try{
        const userCredential = await confirmation.confirm(otp);
        return userCredential.user;
    }catch(err){
        console.error("OTP verification failed: ",err);
        throw err;
    }
};

export const createUser = async(contact: string, user: User)=>{
    const userRef = doc(db, 'users', contact);
    await setDoc(userRef,{...user});
}


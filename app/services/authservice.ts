import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '../modals/user';

export const UserExists = async(contact: string)=>{
    const userRef = await firestore().collection('users').where('contact', '==', contact).get();
    return !userRef.empty;
};

export const sendOtp = async(contact: string) => {
    try{
        const formattedContact = contact.startsWith('+') ? contact : `+91${contact}`;
        const confirmation = await auth().signInWithPhoneNumber(formattedContact);
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

export const createUser = async(uid: string, user: User)=>{
    await firestore().collection('users').doc(uid).set(user);
}

export const emailUserExixts = async(email: string) => {
    const userRef = await firestore().collection('users').where('email', '==', email).get();
    return !userRef.empty;
};

export const signupWithEmail = async ( email: string, password: string) => {
    try{
        const credential = await auth().createUserWithEmailAndPassword(email, password);
        return credential.user;
    }catch(err){
        console.error("Email Signup error:", err);
        throw err;
    }
};

export const loginWithEmail = async(email:string, password:string) => {
    try{
        const credential = await auth().signInWithEmailAndPassword(email, password);
        return credential.user;
    }catch(err){
        console.error("Email lofgin error:", err);
        throw err;
    }
}

export const TechnicianLogin = async(email: string, password:string) => {
    try{
        const userRef = await firestore().collection('technicians').where("email", "==", email).limit(1).get();
        
        if(userRef.empty){
            console.error("Invalid Credentials");
        }

        const technician = userRef.docs[0].data();
        if(technician.password != password){
            throw new Error("Invalid Credentials");
        }

        return {
            id: userRef.docs[0].id,
            ...technician
        }
    }catch(err){
        console.error("Error While logging in as Technician", err);
        throw err;
    }
};
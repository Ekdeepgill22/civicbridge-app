import { User } from '@/modals/user';
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


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
    const userSnap = await firestore().collection('users').doc(contact).get();
    return userSnap.exists();
};

export const sendOtp = async(contact: string) => {
    try{
        const formattedContact = contact.startsWith('+') ? contact : `+91${contact}`;
        const confirmation = await signInWithPhoneNumber(getAuth(), formattedContact);
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

export const createUser = async(contact: string, user: User)=>{
    await firestore().collection('users').doc(contact).set({
        ...user,
    });
};


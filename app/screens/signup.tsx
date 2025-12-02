// import { useAuth } from "../contexts";
// import { User } from "../modals/user";
// import { UserExists, createUser, sendOtp, verifyOtp } from "@/services/authservice";
// import { useRouter } from 'expo-router';
// import { Timestamp } from "firebase/firestore";
// import React, { useState } from "react";
// import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function signup (){

//     const router = useRouter();
//     const [name, setname] = useState("");
//     const [ contact, setContact ] = useState("");
//     const [ otp, setOtp ] = useState("");
//     const { confirmation, setConfirmation } = useAuth();
//     const [ step, setStep ] = useState<'details' | 'otp'>('details');
//     const [ loading, setLoading ] = useState(false);
//     const [ error, setError] = useState('');
//     const [ recaptchReady,setRecaptchaReady] = useState(false);

//     const handlesignup = async() =>{
//         if(name.trim().length < 2){
//             Alert.alert(
//                 'Invalid Name',
//                 'Please enter a valid name(at least 2 characters)'
//             );
//             return;
//         }
//         if(contact.length !==10 ){
//             Alert.alert(
//             'Invalid phone number',
//             'Please enter a 10 digit valid phone number'
//             );
//             return;
//         }
//         setLoading(true);
//         setError('')
//         try{
//             const exists = await UserExists(contact);
//             if(exists){
//                 Alert.alert(
//                     'User Already Exists',
//                     'An Account with this phone number already exists. Please login instead.',
//                     [
//                         {
//                             text: 'Go to login',
//                             onPress: ()=> router.push('/(auth)/login'),
//                         },
//                         {
//                             text: 'Cancel',
//                             style: 'cancel',
//                         },
//                     ]
//                 );
//                 setLoading(false);
//                 return;
//             }
//             const phoneNumber = `+91${contact}`
//             const confirmResult = await sendOtp(phoneNumber);
//             setConfirmation(confirmResult);
//             setStep('otp');
//         }catch(err: any){
//             console.log("Error during signup: ", err);
//             Alert.alert('Error', 'Something went wrong. Please try again');
//             setError(err.message || 'Failed to send OTP. Please try again.');
//         }finally{
//             setLoading(false);
//         }
//     };

//     const handleVerifyOtp = async()=>{
//         if(!confirmation){
//             Alert.alert('Error',"No confirmation Found. Please try again.");
//             setStep('details');
//             return;
//         }
//         if(otp.length < 6){
//             Alert.alert("Invalid OTP","Please enter a valid 6-digit code.");
//             return;
//         }
//         setLoading(true);
//         try{
//             const userCredential = await verifyOtp( confirmation, otp);
//             if(userCredential){
//                 const newUser: User ={
//                     user_id: userCredential.uid,
//                     name: name.trim(),
//                     contact: contact,
//                     created_at: Timestamp.now()
//                 };
//                 await createUser(contact, newUser);
//                 router.replace("/(screens)/home");
//             }
//             }catch(err){
//                 console.log("OTP verification Error:", err);
//                 throw err;
//             }finally{
//                 setLoading(false);
//             }
//         };

//         if(step === 'otp'){
//             return(
//                 <Verify
//                 phoneNumber={`+91${contact}`}
//                 onVerify={handleVerifyOtp}
//                 title="Verify your number"
//                 />
//             );
//         }
    
//     return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}>
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled">
//           <View style={styles.content}>
//             {/* Header Section */}
//             <View style={styles.header}>
//               <Text style={styles.title}>Sign Up</Text>
//               <Text style={styles.subtitle}>
//                 Create your account to get started
//               </Text>
//             </View>
//             {/* Form Section */}
//             <View style={styles.form}>
//               {/* Name Input */}
//               <View style={styles.inputWrapper}>
//                 <Text style={styles.label}>Full Name</Text>
//                 <View style={styles.inputContainer}>
//                   <TextInput
//                     style={styles.input}
//                     value={name}
//                     onChangeText={(text) => {
//                       setname(text);
//                       setError('');
//                     }}
//                     placeholder="Enter your full name"
//                     placeholderTextColor="#A0A7AF"
//                     autoCapitalize="words"/>
//                 </View>
//               </View>
//               {/* Phone Number Input */}
//               <View style={styles.inputWrapper}>
//                 <Text style={styles.label}>Phone Number</Text>
//                 <View style={styles.inputContainer}>
//                   {/* Flag and Country Code */}
//                   <View style={styles.countryContainer}>
//                     <Image
//                       source={require('@/assets/images/world.png')}
//                       style={styles.flag}
//                       resizeMode="contain"/>
//                     <Text style={styles.countryCode}>+91</Text>
//                   </View>
//                   <TextInput
//                     style={styles.input}
//                     value={contact}
//                     onChangeText={(text) => {
//                       const formatted = text.replace(/[^0-9]/g, '');
//                       setContact(formatted);
//                       setError('');
//                     }}
//                     placeholder="Enter phone number"
//                     keyboardType="phone-pad"
//                     placeholderTextColor="#A0A7AF"
//                     maxLength={10}
//                   />
//                 </View>
//               </View>
//               {error ? <Text style={styles.errorText}>{error}</Text> : null}
//               {/* Sign Up Button */}
//               <TouchableOpacity
//                 style={[styles.button, loading && styles.buttonDisabled]}
//                 onPress={handlesignup}
//                 disabled={loading}>
//                 {loading ? (
//                   <ActivityIndicator color="#FFFFFF" />
//                 ) : (
//                   <Text style={styles.buttonText}>Sign Up</Text>
//                 )}
//               </TouchableOpacity>
//               {/* Login Link */}
//               <TouchableOpacity
//                 style={styles.loginContainer}
//                 onPress={() => router.push('/(auth)/login')}>
//                 <Text style={styles.loginText}>
//                   Already have an account?{' '}
//                   <Text style={styles.loginLink}>Login</Text>
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 60,
//   },
//   header: {
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: '700',
//     color: '#1f3b6eff',
//     marginBottom: 12,
//   },
//   subtitle: {
//     fontSize: 15,
//     color: '#5C6B73',
//     lineHeight: 22,
//   },
//   form: {
//     flex: 1,
//   },
//   inputWrapper: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginBottom: 8,
//     marginLeft: 4,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#E2EAF0',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   countryContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   flag: {
//     width: 28,
//     height: 20,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   countryCode: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1f3b6eff',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#2C3E50',
//     paddingVertical: 16,
//   },
//   errorText: {
//     color: '#E74C3C',
//     fontSize: 14,
//     marginTop: 6,
//     marginLeft: 4,
//   },
//   button: {
//     backgroundColor: '#7abb6dff',
//     paddingVertical: 18,
//     borderRadius: 28,
//     alignItems: 'center',
//     marginTop: 24,
//     shadowColor: '#7abb6dff',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 17,
//     fontWeight: '600',
//     letterSpacing: 0.3,
//   },
//   loginContainer: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   loginText: {
//     fontSize: 15,
//     color: '#7F8C8D',
//   },
//   loginLink: {
//     color: '#1f3b6eff',
//     fontWeight: '600',
//   },
// });
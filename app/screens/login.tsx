import { useAuth } from "../contexts/AuthContext";
import { UserExists, sendOtp} from "../services/authservice";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function loginpage(){
    const navigation = useNavigation<LoginNavProp>();
    const [ contact, setContact ] = useState("");
    const { confirmation, setConfirmation } = useAuth();
    const [ step, setStep ] = useState<'contact' | 'otp'>('contact');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError] = useState('');

    const handleVerifyPhone = async() =>{
      if(contact.length !==10 ){
              Alert.alert(
                'Invalid phone number',
                'Please enter a 10 digit valid phone number'
              );
              return;
            }
        setLoading(true);
        setError('');
        try{
            const exists = await UserExists(contact);
            if(exists){
                const phonenumber = `+91${contact}`;
                const confirmresult = await sendOtp(phonenumber);
                setConfirmation(confirmresult);
                navigation.navigate('Verify', { phoneNumber:`+91${contact}`,})
                setStep('otp');
            }else{
                Alert.alert(
                    'User Not Found',
                    'No user found with this Phone Number. Please Sign up first',
                [
                    {
                    text: 'Sign Up',
                    onPress: () => navigation.navigate('Signup'),
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    }
                ]
            );
        }
        }catch(err: any){
            console.log("Error during sign in ",err);
            Alert.alert('Error', 'Something went wrong. Please try again');
            setError(err.message || 'Failed to send OTP. Please try again.');
        }finally{
          setLoading(false);
        }
    };
    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>
            Please enter the number that was used earlier for login
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            {/* Flag and Country Code */}
            <View style={styles.countryContainer}>
              <Image
              source={require('../../assets/images/world.png')}
              style={styles.flag}
              resizeMode="contain"/>
              <Text style={styles.countryCode}>+91</Text>
            </View>

            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={(text) => {
                // ensure only digits are entered
                const formatted = text.replace(/[^0-9]/g, '');
                setContact(formatted);
                setError('');
              }}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#A0A7AF"
              maxLength={10}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyPhone}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Signup Link */}
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>
              New user?{' '}
              <Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1f3b6eff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#5C6B73',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2EAF0',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flag: {
    width: 28,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f3b6eff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 16,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#7abb6dff',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#7abb6dff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  signupContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 15,
    color: '#7F8C8D',
  },
  signupLink: {
    color: '#1f3b6eff',
    fontWeight: '600',
  },
});

      // const docRef = this.dbRef.doc('setup/app-config').ref;
      // const snap = await docRef.get();
      // const storagePath = snap.data()?.['onboardingUrl'];

      // const fileRef = this.storage.refFromURL(storagePath);
      // const url = await fileRef.getDownloadURL().toPromise();

      // this.http.get(url, { responseType: 'blob'}).subscribe({
      //   next: (blob) => {
      //     FileSaver.saveAs(blob, 'onboarding.json');
      //   },
      //   error: (err) => console.error('Download error: ', err)
      //  })
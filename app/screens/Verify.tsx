import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../contexts/AuthContext';
import { verifyOtp } from '../services/authservice';

// Route + Nav types for this screen
type VerifyRouteProp = RouteProp<AuthStackParamList, 'Verify'>;
type VerifyNavProp = NativeStackNavigationProp<AuthStackParamList, 'Verify'>;

export default function Verify()
  {
  const route = useRoute<VerifyRouteProp>();
  const navigation = useNavigation<VerifyNavProp>();

  const { confirmation } = useAuth(); 
  const phoneNumber : string | any = route.params.phoneNumber;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChangeText = (text: string, index: number) => {
    setError('');
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter complete code');
      return;
    }
    
    if (!confirmation) {
      setError('No confirmation found. Please request OTP again.');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOtp(confirmation, otpCode);
      if(result) {
        navigation.navigate("AppTabs");
      }else{
        setError('Verification failed. Please try again')
      }
    } catch (err) {
      setError('Wrong code, please try again');
    } finally {
      setLoading(false);
    }
  };

  const displaySubtitle = `We've sent an SMS with an activation code to your phone ${phoneNumber}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify your phone number</Text>
        <Text style={styles.subtitle}>{displaySubtitle}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                error && styles.otpInputError,
                digit && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f3b6eff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    lineHeight: 22,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#E8F1F5',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2C3E50',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#5F7C8A',
    backgroundColor: '#F8FAFB',
  },
  otpInputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  resendText: {
    fontSize: 15,
    color: '#7F8C8D',
  },
  resendLink: {
    fontSize: 15,
    color: '#5F7C8A',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#BDC3C7',
  },
  timerText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
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
});

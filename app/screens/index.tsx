import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type indexNavProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<indexNavProp>()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.heroImage}
            resizeMode="contain"/>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Welcome to <Text style={styles.titleHighlight}>CivicBridge</Text>
          </Text>

          <Text style={styles.description}>
            Report. Resolve. Rebuild — Together
          </Text>
        </View>

        <TouchableOpacity
          style={styles.buttonPrimary}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonPrimaryText}>Continue with Phone Number</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('LoginEmail')}>
          <Text style={styles.buttonSecondaryText}>Continue with Email</Text>
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
    paddingBottom: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    color:'#FFFFFF'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    maxHeight: 750,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f3b6eff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  titleHighlight: {
    color: '#7abb6dff',
  },
  description: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  buttonPrimary: {
    backgroundColor: '#7abb6dff',
    paddingVertical: 16,
    borderRadius: 26,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },

  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonSecondary: {
    backgroundColor: '#1f3b6eff',
    paddingVertical: 16,
    borderRadius: 26,
    alignItems: 'center',
    elevation: 3,
  },

  buttonSecondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={()=>router.push('/(auth)/login')} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/logo.png")}
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
          style={styles.button}
          onPress={()=> router.push('/(auth)/signup')}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Get Started</Text>
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
  skipContainer: {
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#1f3b6eff',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
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
    marginTop: 20,
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
  button: {
    backgroundColor: '#7abb6dff',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#7abb6dff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

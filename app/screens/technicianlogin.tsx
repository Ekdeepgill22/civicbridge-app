import { TechnicianLogin } from "../services/authservice";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator,Alert,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, "TechnicianLogin">;

export default function technicianLogin() {
  const navigation = useNavigation<LoginNavProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const pattern = /\S+@\S+\.\S+/;
    return pattern.test(email);
  };

  const handleEmailLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert("Invalid Password", "Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const technician = await TechnicianLogin(email, password);
      console.log("Logged in:", technician.id);

      navigation.navigate("AppTabs"); 
    } catch (err: any) {
      console.error(err);

      let errorMsg = err.message || "Login failed. Try again.";

      if (err) {
        errorMsg = "No account exists with this email.";
        Alert.alert("Technician Not Found");
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Login as Technician</Text>
          <Text style={styles.subtitle}>
            Enter your email and password to continue
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#1f3b6eff"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError("");
            }}
          />

        <View style={styles.passwordContainer}>
            <TextInput
            style={[styles.input, { paddingRight: 45 }]}
            placeholder="Password"
            placeholderTextColor="#1f3b6eff"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(t) => {
            setPassword(t);
            setError("");
            }}
            />

            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#1f3b6eff"
            />
            </TouchableOpacity>
        </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  header: { marginBottom: 50 },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1f3b6eff",
    marginBottom: 12,
  },
  subtitle: { fontSize: 15, color: "#5C6B73", lineHeight: 22 },
  form: { flex: 1 },
  input: {
    borderWidth: 2,
    borderColor: "#E2EAF0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    fontSize: 16,
    color: "#2C3E50",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#7abb6dff",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#7abb6dff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  signupContainer: { marginTop: 24, alignItems: "center" },
  signupText: { fontSize: 15, color: "#7F8C8D" },
  signupLink: { color: "#1f3b6eff", fontWeight: "600" },

  passwordContainer: {
  position: "relative",
  justifyContent: "center",
  },

  eyeButton: {
  position: "absolute",
  right: 15,
  top: "50%",      
  transform: [{ translateY: -20 }],
  padding: 4,
  zIndex: 5,
  },
});

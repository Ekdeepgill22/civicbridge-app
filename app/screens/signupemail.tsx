import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ActivityIndicator,Alert,ScrollView} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/types";
import { signupWithEmail,createUser,emailUserExixts} from "../services/authservice";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useAuth } from "../contexts/AuthContext";

type EmailSignupNavProp = NativeStackNavigationProp<AuthStackParamList, "EmailSignup">;

export default function EmailSignupPage() {
  const navigation = useNavigation<EmailSignupNavProp>();
  const {setAuthType} = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSignup = async () => {
    if (!name.trim() || !address.trim() || !city.trim()) {
      Alert.alert("Missing Details", "All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const exists = await emailUserExixts(email);
      if (exists) {
        Alert.alert("User Exists", "Email already registered. Please login.");
        return;
      }

      const user = await signupWithEmail(email, password);

      const userData = { user_id: user.uid, name,address,city,email,created_at: firestore.Timestamp.now(), account_email_send:false};

      await createUser(user.uid, userData);

      Alert.alert("Success", "Account created successfully!");
      setAuthType('user');
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Create your account by filling the details below
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#1f3b6eff"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setError("");
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#1f3b6eff"
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              setError("");
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#1f3b6eff"
            value={city}
            onChangeText={(t) => {
              setCity(t);
              setError("");
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
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
            style={[styles.input, { paddingRight: 45 }]} // gives space for icon
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

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => navigation.navigate("LoginEmail")}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
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
  subtitle: {
    fontSize: 15,
    color: "#5C6B73",
    lineHeight: 22,
  },

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

  loginContainer: { marginTop: 24, alignItems: "center" },
  loginText: { fontSize: 15, color: "#7F8C8D" },
  loginLink: { color: "#1f3b6eff", fontWeight: "600" },

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

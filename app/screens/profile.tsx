import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { getVersion } from "react-native-device-info";

export default function Profile() {
  const { user, userProfile, signOut } = useAuth();

  const appVersion = getVersion();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.heading}>Profile</Text>
      </View>
      <View style={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Details</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{ userProfile?.name || "User"}</Text>

        {userProfile?.contact ? (
        <>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>
          {userProfile?.contact || "N/A"}
        </Text>
        </>
        ): (
        <>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>
          {userProfile?.email || "N/A"}
        </Text>
        </>
        )}
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>
          {userProfile?.address.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Not Provided"}
        </Text>
        <Text style={styles.label}>City</Text>
        <Text style={styles.value}>
          {userProfile?.city || "Not Provided"}
        </Text>
        <Text style={styles.label}>Account Created</Text>
        <Text style={styles.value}>
          {userProfile?.created_at.toDate().toDateString() || "Not Provided"}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Information</Text>
        <Text style={styles.label}>App Version</Text>
        <Text style={styles.value}>{appVersion}</Text>
         <Text style={styles.label}>Privacy Policy</Text>
        <Text style={styles.valueSmall}>
          We only collect basic account information
          to manage your profile and handle complaint submissions. Your data is
          never shared with third parties.
        </Text>

        <Text style={styles.label}>Terms of Service</Text>
        <Text style={styles.valueSmall}>
          By using this app, you agree to submit accurate information and avoid
          misuse of the complaint system. Improper or abusive submissions may
          result in account restrictions.
        </Text>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.bottomBlue} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#1f3b6e",
    paddingVertical:30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 1,
  },

  content: {
    marginTop: -40,
    paddingHorizontal: 20,  
    zIndex: 2, 
    paddingBottom: 10,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffffff",
    marginBottom: 20,
    textAlign: "center"
  },

  card: {
    backgroundColor: "#f5f6fa",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#00000030",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f3b6e",
    marginBottom: 3,
  },

  label: {
    fontSize: 13,
    color: "#888",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f3b6e",
  },

  valueSmall: {
    fontSize: 14,
    color: "#1f3b6e",
    marginTop: 5,
    lineHeight: 20,
    textAlign: "justify"
  },

  signOutButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,
  },

  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomBlue: {
    height: "24%",
    backgroundColor: "#1f3b6e",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, 
  },
});
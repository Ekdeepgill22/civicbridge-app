import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Loader() {
  return (
    <View style={styles.overlay}>
      <View style={styles.spinnerBox}>
        <ActivityIndicator size="large" color="#1f3b6e" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",   // dim background
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
});

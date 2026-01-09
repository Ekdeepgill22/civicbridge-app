import React, { useState } from "react";
import { Modal,View,Text,TouchableOpacity,TextInput,StyleSheet,Alert,Image,ScrollView} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Complaint } from "../modals/complaint";
import { technicians } from "../modals/technician";
import Loader from "./Loader";

interface Props {
  visible: boolean;
  complaint: Complaint | null;
  technician :  technicians | null;
  onClose: () => void;
}

export default function ComplaintActionModal({visible,complaint,technician,onClose}: Props) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!complaint || !technician) return null;

  const updateStatus = async (status: "Resolved" | "Rejected") => {
    if (!note.trim()) {
      Alert.alert("Note required", "Please add a note before proceeding.");
      return;
    }

    try {
      setLoading(true);

      await firestore().collection("complaints").doc(complaint.doc_id).update({
        status,
        resolution_note: note,
        updated_at: firestore.Timestamp.now(),
        });

      await firestore().collection("technicians").doc(technician.assigned_to_id).update({
        free: true,
        assigned_complaints: +1,
        current_complaint: ''
      })

      onClose();
      setNote("");
    } catch (err) {
      console.error("Error updating complaint", err);
      Alert.alert("Error", "Unable to update complaint");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />

  const hasImage = Boolean(complaint.image_url);

    return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <View style={styles.headerRow}>
            <Text style={styles.title}>{complaint.title}</Text>
            <View style={[styles.statusBadge,styles[`status_${complaint.status}`]]}>
              <Text style={styles.statusText}>{complaint.status}</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.body}>
              {hasImage ? (
                <Image
                  source={{ uri: complaint.image_url }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}

              <View style={styles.details}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{complaint.category.replace(/_/g, " ")}</Text>

                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{complaint.description}</Text>

                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{complaint.address}</Text>

                <Text style={styles.label}>Submitted On</Text>
                <Text style={styles.value}>
                  {complaint.submitted_at.toDate().toDateString()}
                </Text>
              </View>
            </View>

            <Text style={styles.noteLabel}>Resolution / Rejection Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Enter resolution or rejection reason"
              multiline
              style={styles.input}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.resolve]}
                onPress={() => updateStatus("Resolved")}>
                <Text style={styles.btnText}>Resolve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.reject]}
                onPress={() => updateStatus("Rejected")}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "90%",
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f3b6e",
    flex: 1,
    paddingRight: 10,
  },

  /* Status */
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  status_Pending: { backgroundColor: "#f7c948" },
  status_InProgress: { backgroundColor: "#61a0ff" },
  status_Resolved: { backgroundColor: "#4caf50" },
  status_Rejected: { backgroundColor: "#e74c3c" },

  /* Body */
  body: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  placeholder: {
    width: 120,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#999",
  },
  details: {
    flex: 1,
    marginTop: -8
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    marginTop: 4,
  },
  value: {
    fontSize: 13,
    color: "#333",
  },

  /* Note */
  noteLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: "top",
  },

  /* Actions */
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  resolve: {
    backgroundColor: "#4caf50",
  },
  reject: {
    backgroundColor: "#e74c3c",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  cancel: {
    textAlign: "center",
    marginTop: 25,
    color: "#555",
    fontWeight: "600",
  },
});


import React from "react";
import {Modal,View,Text,StyleSheet,TouchableOpacity,ScrollView,Image} from "react-native";
import { Complaint } from "../modals/complaint";

interface Props {
  visible: boolean;
  complaint: Complaint | null;
  onClose: () => void;
}

export default function UserComplaintViewModal({visible,complaint,onClose,}: Props) {
  if (!complaint) return null;

  const hasImage = Boolean(complaint.image_url);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{complaint.title}</Text>
            <View style={[styles.statusBadge, styles[`status_${complaint.status}`]]}>
                <Text style={styles.statusText}>{complaint.status}</Text>
            </View>
            </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.body}>
              <View style={styles.leftColumn}>
                {hasImage ? (
                <Image source={{ uri: complaint.image_url }} style={styles.image} />
                ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
                )}
                {complaint.technician_name && complaint.technician_contact ? (
                <View style={styles.techInfo}>
                    <Text style={styles.techLabel}>Technician Detais</Text>
                    <Text style={styles.techValue}>Name: {complaint.technician_name}</Text>
                    <Text style={styles.techValue}>Contact: {complaint.technician_contact}</Text>
                </View>
                ) : (
                <Text style={styles.noTech}>No technician assigned yet</Text>
                )}
                </View>
                <View style={styles.details}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>
                  {complaint.category.replace(/_/g, " ")}
                </Text>

                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{complaint.description}</Text>

                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{complaint.address}</Text>

                <Text style={styles.label}>Submitted</Text>
                <Text style={styles.value}>
                  {complaint.submitted_at.toDate().toDateString()}
                </Text>

                {complaint.resolution_note ? (
                  <>
                    <Text style={styles.label}>Resolution Note</Text>
                    <Text style={styles.value}>
                      {complaint.resolution_note}
                    </Text>
                  </>
                ) : null}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
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
    headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    },

    title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f3b6e",
    flex: 1,
    paddingRight: 10,
    textAlign: "left",
    },
  body: {
  flexDirection: "row",
  gap: 16,
  alignItems: "flex-start",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
  },
  leftColumn: {
  width: 130,
  alignItems: "center",
  },
    statusBadge: {
    marginTop: 8,
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

    techInfo: {
    marginTop: 10,
    alignItems: "center",
    },

    techLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    },

    techValue: {
    fontSize: 13,
    color: "#333",
    },

    noTech: {
    marginTop: 10,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    },

  details: {
    flex: 1,
    marginTop:-6
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
  closeBtn: {
    marginTop: 20,
    alignSelf: "center",
  },
  closeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f3b6e",
  },
});

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Complaint } from "../modals/complaint";
import Loader from "../components/Loader";
import UserComplaintViewModal from "../components/UserComplaintViewModal";

export default function ComplaintHistory() {

  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing,setRefreshing] = useState(false);

  useEffect(() =>{
    const unsubscribe = firestore().collection("complaints").where("user_id", "==", user.uid).orderBy("submitted_at", "desc")
    .onSnapshot(
      (snapshot) =>{
        const list: Complaint[] = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data(), doc_id:doc.id} as Complaint);
        });
        setComplaints(list);
        setLoading(false);
      },
      (err) =>{
        console.error("History fetch failed: ", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  function refreshHistory(){
     setRefreshing(true);

    firestore().collection("complaints").where("user_id","==", user.uid).orderBy("submitted_at", "desc").get()
    .then(snapshot =>{
      const list: Complaint[] = [];
      snapshot.forEach(doc => list.push({ ...doc.data(), doc_id: doc.id } as Complaint));
      setComplaints(list);
    }).catch(err => {
      console.error("Refresh failed:", err);
      setRefreshing(false);
    }).finally(() => {
      setRefreshing(false);
    });
  }

  if (loading) return <Loader />;

  return (
    <>
    <ScrollView style={styles.container} refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={refreshHistory} colors={["#1f3b6e"]} tintColor="#1f3b6e"/>
      }>
      <View style={styles.header}>
        <Text style={styles.heading}>Your Complaint History</Text>
      </View>
      <View style={styles.content}>
      {complaints.length === 0 ? (
        <View style={{ minHeight:600, justifyContent: "center"}}>
        <Text style={styles.emptyText}>No complaints submitted yet</Text>
        </View>
      ) : (
        complaints.map((c) => (
          <View key={c.doc_id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>
                {c.title.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </Text>
              <View style={[styles.statusBadge, styles[`status_${c.status}`]]}>
                <Text style={styles.statusText}>{c.status}</Text>
              </View>
            </View>
            <Text style={styles.item}>
              Date: {c.submitted_at.toDate().toDateString()}
            </Text>
            <Text style={styles.item}>
              Category: {c.category.replace(/_/g, " ")}
            </Text>
            <Text style={styles.item}>
              Address: {c.address.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </Text>
            <TouchableOpacity style={styles.viewBtn} onPress={() => {
              setSelectedComplaint(c);
              setModalVisible(true);
            }}>
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>
          </View>
        ))
      )}
      </View>
    </ScrollView>
    <UserComplaintViewModal
      visible={modalVisible}
      complaint={selectedComplaint}
      onClose={() => {
        setModalVisible(false);
        setSelectedComplaint(null);
      }}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff"},

  header: {
    backgroundColor: "#1f3b6e",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 1,
  },

  content: {
    flex: 1,
    marginTop: -30,
    paddingHorizontal: 20,
    marginBottom: 30,   
    zIndex: 2, 
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffffff",
    marginBottom: 25,
    textAlign: "center"
  },

  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 40,
  },

  // Card styling
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    elevation: 4,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#7abb6dff",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f3b6e",
    flex: 1,
    paddingRight: 10,
  },

  item: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },

  // Badge
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

  // Status colors
  status_Pending: { backgroundColor: "#f7c948" },
  status_InProgress: { backgroundColor: "#61a0ff" },
  status_Resolved: { backgroundColor: "#4caf50" },
  status_Rejected: { backgroundColor: "#e74c3c" },

  refreshBtn: {
  backgroundColor: "#7abb6d",
  paddingVertical: 12,
  marginTop: 5,
  borderRadius: 10,
  marginBottom: 5,
  alignItems: "center",
  },

  refreshText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  
  viewBtn: {
  marginTop: 10,
  backgroundColor: "#1f3b6e",
  paddingVertical: 8,
  borderRadius: 8,
  alignItems: "center",
},

viewText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 14,
},
});
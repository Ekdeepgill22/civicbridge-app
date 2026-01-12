import { useAuth } from '../contexts/AuthContext';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import firestore from "@react-native-firebase/firestore";
import { Complaint } from '../modals/complaint';
import Loader from "../components/Loader";

export default function TechnicianDashboard() {
  const { technician, technicianProfile, loading } = useAuth();

  const [recentComplaint, setRecentComplaint ] = useState<Complaint | null >(null);
  const [stats, setStats ] = useState({
    pending: 0, inProgress: 0, resolved: 0, rejected:0
  });

  const [ dataLoading, setDataLoading ] = useState(true);
  useEffect(() => {
    if (!technicianProfile) {
        setDataLoading(false); 
        return
    };

    const unsubscribe = firestore().collection("complaints").where("assigned_to_id", "==", technicianProfile?.assigned_to_id).orderBy("submitted_at", "desc")
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            setRecentComplaint(null);
            setStats({
              pending: 0,
              inProgress: 0,
              rejected: 0,
              resolved: 0,
            });
            setDataLoading(false);
            return;
          }

          let latest: Complaint | null = null;

          let statCounts = {
            pending: 0,
            inProgress: 0,
            rejected: 0,
            resolved: 0,
          };

          snapshot.forEach((doc) => {
            const data = doc.data() as Complaint;

            if (!latest) {
              latest = { ...data, doc_id: doc.id };
            }

            switch (data.status) {
              case "Pending":
                statCounts.pending++;
                break;
              case "InProgress":
                statCounts.inProgress++;
                break;
              case "Rejected":
                statCounts.rejected++;
                break;
              case "Resolved":
                statCounts.resolved++;
                break;
            }
          });

          setRecentComplaint(latest);
          setStats(statCounts);
          setDataLoading(false);
        },
        (error) => {
          console.error("Firestore onSnapshot error:", error);
          setDataLoading(false);
        }
      );

    return () => unsubscribe();
  }, [technician]);

  if (loading || dataLoading ) return <Loader />;

  return (
    <View style={styles.container}>

      {/* TOP BLUE HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.username}>{technicianProfile?.name || "Technician"}</Text>
        <Text style={styles.greetingLine}>Hope you're having a great day!</Text>
      </View>

      {/* CONTENT OVER THE CURVE */}
      <View style={styles.content}>

        {/* RECENT COMPLAINT CARD */}
        
      <View style={styles.recentCard}>
        <Text style={styles.cardTitle}>Most Recent Complaint</Text>
          {recentComplaint ? (
            <>
              <View style={styles.rowBetween}>
                <Text style={styles.complaintTitle}>{recentComplaint.title.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    styles[`status_${recentComplaint.status}`],
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {recentComplaint.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.item}>
                Date: {recentComplaint.submitted_at.toDate().toDateString()}
              </Text>
              <Text style={styles.item}>
                Category: {recentComplaint.category.replace(/_/g, " ")}
              </Text>
              <Text style={styles.item}>
                Address: {recentComplaint.address.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </Text>
            </>
          ) : (
            <View style= {{ alignItems:"center", paddingVertical: 20 }}>
            <Text style={styles.item}>No complaints submitted yet.</Text>
            </View>
          )}
        </View>
        {/* STATS GRID */}
        <Text style={styles.sectionTitle}>Your Complaints</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, styles.statPending]}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={[styles.statBox, styles.statInProgress]}>
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>

          <View style={[styles.statBox, styles.statResolved]}>
            <Text style={styles.statNumber}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>

          <View style={[styles.statBox, styles.statRejected]}>
            <Text style={styles.statNumber}>{stats.rejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        <Text style={styles.appTagline}>
        Report municipal issues quickly and track their resolution.
      </Text>

      </View>
      <View style={styles.bottomBlue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // BLUE HEADER
  header: {
    backgroundColor: "#1f3b6e",
    height: "27%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 54,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  welcome: { fontSize: 22, color: "#e6e6e6", opacity: 0.8 },
  username: { fontSize: 30, fontWeight: "700", color:"#F5F7FA"},
  greetingLine: {fontSize: 14, color: "#e6e6e6", marginTop: 4, opacity: 0.9},

  // CONTENT OVERLAP
  content: {
    flex: 1,
    marginTop: -40,
    paddingHorizontal: 20,
    marginBottom: -40,
    paddingBottom: 30,   
    zIndex: 2, 
  },

  // RECENT COMPLAINT
  recentCard: {
  backgroundColor: "#fff",
  padding: 18,
  borderRadius: 16,
  elevation: 4,
  shadowColor: "#00000030",
  marginBottom: 20,
  borderLeftWidth: 4,
  borderLeftColor: "#7abb6dff",
  minHeight: 180,
  justifyContent:"center"
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#1f3b6e",
  marginBottom: 14,
  letterSpacing: 0.3,
  textAlign: "center"
  },

  complaintTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f3b6e",
    flex: 1,
    paddingRight: 10,
  },

  // Status badge
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  // Status Colors
  status_Pending: { backgroundColor: "#f7c948" },
  status_InProgress: { backgroundColor: "#61a0ff" },
  status_Resolved: { backgroundColor: "#4caf50" },
  status_Rejected: { backgroundColor: "#e74c3c" },

  item: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },


  // SECTION TITLE
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#1f3b6e",
  },

  // STATS GRID
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
  width: "48%",
  paddingVertical: 20,
  borderRadius: 14,
  marginBottom: 12,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
  },

  statPending: {
    backgroundColor: "#ffeb99",
  },

  statInProgress: {
    backgroundColor: "#cce0ff", 
  },

  statResolved: {
    backgroundColor: "#b6f2c6", 
  },

  statRejected: {
    backgroundColor: "#ffcccc", 
  },

  statNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1f1f1f",
  },

  statLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },

  // NOTICE
  appTagline: {
  fontSize: 14,
  color: "#f0f1f4ff",
  textAlign: "center",
  marginVertical: 18,
  fontWeight: "500",
  opacity: 0.85,
  letterSpacing: 0.3,
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
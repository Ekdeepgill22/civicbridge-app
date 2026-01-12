import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Modal} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { Category } from "../modals/complaint";
import DropDownPicker from "react-native-dropdown-picker";
import RNFS from "react-native-fs";
import { Image as ImageCompressor } from "react-native-compressor";
import Loader from "../components/Loader";
import { PermissionsAndroid, Platform } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';

export default function RegisterComplaint() {

  const { user,userProfile } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [address, setAddress] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const allCategories: Category[] = [
    "Road_and_Infastructure",
    "Streetlights_and_Electricity",
    "Garbage_and_Sanitation",
    "Water_Supply",
    "Drianage_and_Sewerage",
    "Parks_and_Horticulture",
    "Building_and_Consruction",
    "Trafic_and_Transport",
    "Public_Health_and_Mosquito_Control",
    "Animal_Control",
    "Public_Amenities",
    "Noise_and_Pollution",
    "Education_and_Civic_Awarenes",
    "Other"
  ];

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    allCategories.map((cat) => ({
      label: cat.replace(/_/g, " "),
      value: cat
    }))
  );

  async function requestCamera(){
    if(Platform.OS !== "android") return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "App needs camera access to capture complaint photos",
        buttonPositive: 'OK',
        buttonNegative: "Cancel",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function captureImage(){
    const hasPermission = await requestCamera();
    if(!hasPermission){
      Alert.alert("Permission denied", "Camera persmission requested");
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 1,
      saveToPhotos: false,
    });

    if (result.didCancel) return;

    if(!result.assets || !result.assets[0]?.uri){
      Alert.alert("Capture Failed");
      return;
    }

    try{
      const originalUri = result.assets[0].uri;

      const compressedUri = await ImageCompressor.compress(originalUri, {
        maxWidth:800,
        quality: 0.6,
      });

      const base64 = await RNFS.readFile(compressedUri, 'base64');
      ''
      setImageBase64(`data:image/jpeg;base64,${base64}`);
    }catch(err){
      console.error("Image processing error", err);
      Alert.alert("image processing failed");
    }
  }
  function resetform(){
    setTitle("");
    setDescription("");
    setCategory("Other");
    setAddress("");
    setImageBase64(null);
    setImageUri(null);
    setSubmitting(false);
  }
  async function submitComplaint(){
    if (!title || !description || ! address || !category){
      Alert.alert("Please fill all the required fields.");
      return;
    }

    try{
      setSubmitting(true);
      
      if(imageBase64 && imageBase64.length > 900000){
        Alert.alert("Image too large, please upload a smaller image.");
        return;
      }
      const docref = firestore().collection("complaints").doc()
      await docref.set({
        user_id: user.uid, doc_id: docref.id, user_email: user.email,user_name: userProfile?.name,
        title, description, category, image_url: imageBase64 || "", address, submitted_at: firestore.Timestamp.now(), status:"Pending",
        complaint_email_send: false, technician_assigned_email_send: false, compalint_resolved_email: false,
        // geo_location: location ? new firestore.GeoPoint(location.latitude, location.longitude) : null,
      });

      Alert.alert("Complaint submitted successfully!");
      resetform();
    }catch(err){
      console.error("Submit error:", err);
      Alert.alert("Failed to submit complaint.");
    }finally{
      setSubmitting(false);
    }
  }
  if (submitting) return <Loader />;

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <View style={styles.header}>
        <Text style={styles.heading}>Register New Complaint</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
        <Text style={styles.label}>Title</Text>
        <TouchableOpacity style={styles.resetSmallButton} onPress={resetform}>
          <Ionicons name="trash" size={16} color="#fff" />
          <Text style={styles.resetSmallText}>Reset</Text>
        </TouchableOpacity>
        </View>
        <TextInput style={styles.input} placeholder="Enter complaint title" placeholderTextColor="#605e5eff" value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} placeholder="Enter complaint description" placeholderTextColor="#605e5eff" value={description} onChangeText={setDescription} />
        <Text style={styles.label}>Category</Text>
        <View style={{ zIndex: 3000, height: open ? 260 : undefined }}>
        <DropDownPicker
          open={open}
          value={category}
          items={items}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setItems}
          placeholder="Select Complaint category"
          listMode="SCROLLVIEW"
          scrollViewProps={{ nestedScrollEnabled: true }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
          labelStyle={styles.dropdownLabel}
          listItemLabelStyle={styles.dropdownText}
        />
        </View>
        <View style={{ zIndex: 2000 }}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="Enter complaint Address" placeholderTextColor="#605e5eff" value={address} onChangeText={setAddress} />
        </View>
        <View style={{ zIndex: 1000 }}>
        <View style={styles.captureHeader}>
          <Text style={styles.imagelabel}>Upload Image</Text>
          {!imageBase64 ? (
            <TouchableOpacity onPress={captureImage} style={styles.cameraIconWrapper}>
              <Ionicons name="camera" size={16} color="#fff" />
              <Text style={styles.retakeText}>Capture</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={captureImage} style={styles.cameraIconWrapper}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          )}
        </View>
        {imageBase64 ? (
          <Image source={{ uri: imageBase64 }}
          style={{ width: '100%', height:200, borderRadius:10, marginBottom:10, marginTop:10}}/>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#9aa0a6" />
              <Text style={styles.placeholderText}>
                Capture image to see preview of image
              </Text>
          </View>
        )}
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#7abb6d", marginTop: 20 }]} 
        onPress={submitComplaint} disabled={submitting}>
          <Text style={styles.buttonText}>{ submitting ? "Submitting....": "Submit Compalint"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#1f3b6e",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  content: {
    flex: 1,
    marginTop: 2,
    paddingHorizontal: 20,
    paddingBottom: 40
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },

    titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  resetSmallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight:4
  },

  resetSmallText: {
   color: "#fff",
  fontSize: 12,
  fontWeight: "600",
  marginLeft: 4,
  },

  label: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: "600",
    color: "#1f3b6e",
  },

  imagelabel:{
    marginTop: 11,
    fontSize: 15,
    fontWeight: "600",
    color: "#1f3b6e",
  },

  input: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    fontSize: 14,
    color: "#333"
  },

  dropdown: {
    borderColor: "#d0d0d0",
    backgroundColor: "#fff",
    borderRadius: 10,
    minHeight: 50,
    zIndex: 5000,
    marginTop: 5
  },

  dropdownContainer: {
    borderColor: "#d0d0d0",
    backgroundColor: "#fff",
    zIndex: 5000,
    elevation: 10,
  },

  dropdownText: {
    fontSize: 15,
    color: "#333",
  },

  dropdownPlaceholder: {
    color: "#999",
    fontSize: 15,
  },

  dropdownLabel: {
    color: "#1f3b6e",
    fontWeight: "600",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#7abb6d",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: 170,
    alignSelf: 'center'
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  captureHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 2
},

cameraIconWrapper: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#1f3b6e",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 16,
  marginTop: 15
},

retakeText: {
  color: "#fff",
  fontSize: 12,
  fontWeight: "600",
  marginLeft: 4,
},

imagePlaceholder: {
  width: "100%",
  height: 200,
  borderRadius: 10,
  borderWidth: 1.5,
  borderStyle: "dashed",
  borderColor: "#cfcfcf",
  backgroundColor: "#fafafa",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
  paddingHorizontal: 20,
},

placeholderText: {
  marginTop: 10,
  fontSize: 13,
  color: "#7a7a7a",
  textAlign: "center",
  lineHeight: 18,
},
});

import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Modal} from "react-native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { Category } from "../modals/complaint";
import DropDownPicker from "react-native-dropdown-picker";
import RNFS from "react-native-fs";
import { Image as ImageCompressor } from "react-native-compressor";
import Loader from "../components/Loader";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";


async function reverseGeocode(lat, lon){
  try{
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const json = await res.json();
    return json.display_name || `${lat}, ${lon}`;
  }catch(err){
    return `${lat}, ${lon}`;
  }
}

async function getUserLocation(){
  const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

  return new Promise((resolve, reject) => {
    if(result === RESULTS.GRANTED){
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    }else{
      reject("Location permission denied");
    }
  });
}

export default function RegisterComplaint() {

  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [address, setAddress] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

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

  async function pickImage(){
    const result = await launchImageLibrary({mediaType: "photo"});
    if(result.assets && result.assets[0]){
      let fileUri = result.assets[0].uri!;

      const compressedUri = await ImageCompressor.compress(fileUri, {
        maxWidth: 800,
        quality: 0.6,
      })
      const base64 = await RNFS.readFile(compressedUri, "base64");
      setImageBase64(`data:image/jpeg;base64,${base64}`);
    }
  }

  // async function uploadImage(): Promise<string>{
  //   if (!imageUri) return "";

  //   console.log("IMAGE URI = ", imageUri);

  //   let path = imageUri;
  //   if(imageUri.startsWith("content://")){
  //     const stat = await RNFS.stat(imageUri);
  //     path = stat.path;
  //   }
  //   if(path.startsWith("file://")){
  //     path = path.replace("file://","");
  //   }
  //   const fileName = `complaints/${user.uid}_${Date.now()}.jpg`;
  //   const ref = storage().ref(fileName);

  //   console.log("UPLOAD PATH = ",path);

  //   await ref.putFile(imageUri);
  //   return await ref.getDownloadURL();
  // }

  async function openMapPicker(){
    try{
      const pos = await getUserLocation();

      setInitialRegion({
        latitude: pos.latitude,
         
      })
    }
  }

  // function closeMapPicker(){
  //   setMapVisible(false);
  // }

  // function handleMapPress(e: MapPressEvent){
  //   const { latitude, longitude } = e.nativeEvent.coordinate;
  //   setTempLocation({ latitude, longitude });
  // }

  // function confirmLocationFromMap(){
  //   if(!tempLocation){
  //     Alert.alert("Please tap on the map to choose a location.");
  //     return;
  //   }
  //   setLocation(tempLocation);
  //   setMapVisible(false);
  // }

  function resetform(){
    setTitle("");
    setDescription("");
    setCategory("Other");
    setAddress("");
    setImageBase64(null);
    setImageUri(null);
    // setLocation(null);
    // setTempLocation(null);
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
        user_id: user.uid, doc_id: docref.id,
        title, description, category, image_url: imageBase64 || "", address, submitted_at: firestore.Timestamp.now(), status:"Pending",
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
        {/* <TouchableOpacity style={[styles.button, {marginTop: 8}]} onPress={openMapPicker}>
          <Text style={styles.button}>Pick Location on Map</Text>
        </TouchableOpacity>
        {location && (
          <Text style={{ marginTop: 6 , fontSize: 12, color:"#555"}}>
            Selected: { location.latitude.toFixed(5)}, { location.longitude.toFixed(5)}
          </Text>
        )} */}
        </View>
        <View style={{ zIndex: 1000 }}>
        <Text style={styles.label}>Upload Image</Text>
        {imageBase64 && (
          <Image source={{ uri: imageBase64 }}
          style={{ width: '100%', height:200, borderRadius:10, marginBottom:10, marginTop:10}}/>
        )}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#1f3b6e", marginTop: 20 }]} 
        onPress={submitComplaint} disabled={submitting}>
          <Text style={styles.buttonText}>{ submitting ? "Submitting....": "Submit Compalint"}</Text>
        </TouchableOpacity>
      </View>
      {/* <Modal visible={mapVisible} animationType="slide">
  <View style={{ flex: 1 }}>
    <MapView
      style={{ flex: 1 }}
      onPress={handleMapPress}
      initialRegion={{
        latitude: tempLocation?.latitude || 28.6139,
        longitude: tempLocation?.longitude || 77.2090,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {tempLocation && (
        <Marker coordinate={tempLocation} />
      )}
    </MapView>

    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.9)",
      }}
    >
      <Text style={{ marginBottom: 8, textAlign: "center", fontWeight: "600" }}>
        Tap on the map to choose location
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={[styles.button, { flex: 1, marginRight: 8, backgroundColor: "#ff4d4d" }]}
          onPress={closeMapPicker}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: "#1f3b6e" }]}
          onPress={confirmLocationFromMap}
        >
          <Text style={styles.buttonText}>Use this location</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal> */}

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
    backgroundColor: "#ff4d4d",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  resetSmallText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  label: {
    marginTop: 15,
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
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface User {
    user_id: string,
    name: string,
    contact?: string,
    created_at: FirebaseFirestoreTypes.Timestamp;  
    email?: string,
    address: string,
    city: string
}

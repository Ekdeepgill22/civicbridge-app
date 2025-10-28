import { Timestamp } from "@react-native-firebase/firestore";

export interface User {
    user_id: string,
    name: string,
    contact: string,
    created_at: Timestamp
}

import { Timestamp } from "firebase/firestore";

export interface User {
    doc_id: string;
    user_id: string,
    name: string,
    contact: string,
    password: string,
    created_at: Timestamp
}

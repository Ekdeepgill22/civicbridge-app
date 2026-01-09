import { Timestamp } from "firebase/firestore";

export interface Complaint {
    doc_id?: string,
    complaint_id: string,
    user_id: string,
    user_email: string,
    assigned_to_id: string,
    title: string,
    description: string,
    category: Category,
    image_url: string,
    geo_locaion: string,
    address: string,
    contact: string,
    submitted_at: Timestamp,
    status: Status,
    updated_at: Timestamp,
    resolution_note: string,
    technician_name: string,
    technician_contact: string,
    complaint_email_send: boolean,
    user_name: string,
    technician_assigned_email_send: boolean,
    compalint_resolved_email: boolean,
}

export type Category = 
    "Road_and_Infastructure" |
    "Streetlights_and_Electricity" |
    "Garbage_and_Sanitation" |
    "Water_Supply" |
    "Drianage_and_Sewerage" |
    "Parks_and_Horticulture" |
    "Building_and_Consruction" |
    "Trafic_and_Transport" |
    "Public_Health_and_Mosquito_Control" |
    "Animal_Control" |
    "Public_Amenities" |
    "Noise_and_Pollution" |
    "Education_and_Civic_Awarenes" |
    "Other";


export type Status = "InProgress" | "Resolved" | "Pending" | "Rejected";

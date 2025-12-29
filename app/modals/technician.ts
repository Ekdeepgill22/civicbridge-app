export interface technicians {
    assigned_to_id: string,
    name: string,
    category: Category,
    designation: string,
    contact: string,
    free: boolean,
    assigned_complaints: {},
    current_complaint: string,
    email: string,
    password: string
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
    "Education_and_Civic_Awarenes";

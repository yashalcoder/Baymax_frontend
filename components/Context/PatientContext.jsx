"use client";
import { createContext,useContext,useState } from "react";
const PatientContext = createContext();
export function PatientProvider({ children }) {
    const [patientData, setPatientData] = useState(null);
    return (
        <PatientContext.Provider value={{ patientData, setPatientData }}>
            {children}
        </PatientContext.Provider>
    );
}
export const usePatient = () => useContext(PatientContext);
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Hospital, Doctor, Patient, Appointment, Revenue } from '../types';

interface DataContextType {
  hospitals: Hospital[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  revenues: Revenue[];
  addHospital: (hospital: Omit<Hospital, 'id' | 'createdAt'>) => void;
  addDoctor: (doctor: Omit<Doctor, 'id' | 'totalEarnings'>) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'registrationDate'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: 'hospital-1',
      name: 'Central Medical Center',
      address: '123 Healthcare Ave, Medical District',
      contactNumber: '+1-555-0101',
      email: 'info@centralmedical.com',
      establishedYear: 1985,
      totalBeds: 250,
      departments: [
        {
          id: 'dept-1',
          hospitalId: 'hospital-1',
          name: 'Cardiology',
          description: 'Heart and cardiovascular care',
          specializations: ['General Cardiology', 'Interventional Cardiology']
        },
        {
          id: 'dept-2',
          hospitalId: 'hospital-1',
          name: 'Neurology',
          description: 'Neurological disorders and brain health',
          specializations: ['General Neurology', 'Neurosurgery']
        }
      ],
      createdAt: new Date('2020-01-01')
    }
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 'doctor-1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@centralmedical.com',
      contactNumber: '+1-555-0201',
      specialization: 'Cardiology',
      yearsOfExperience: 12,
      qualification: 'MD, FACC',
      licenseNumber: 'MD12345',
      hospitalAffiliations: [{
        hospitalId: 'hospital-1',
        departmentId: 'dept-1',
        joinDate: new Date('2020-03-01'),
        isActive: true
      }],
      availabilitySlots: [
        {
          id: 'slot-1',
          doctorId: 'doctor-1',
          hospitalId: 'hospital-1',
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30,
          isActive: true
        }
      ],
      consultationFees: [{
        id: 'fee-1',
        doctorId: 'doctor-1',
        hospitalId: 'hospital-1',
        amount: 200,
        hospitalShare: 30,
        doctorShare: 70
      }],
      totalEarnings: 15000
    }
  ]);

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'patient-1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      contactNumber: '+1-555-0301',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'male',
      address: '456 Patient St, City',
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Spouse',
        contactNumber: '+1-555-0302'
      },
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin'],
      registrationDate: new Date('2023-01-15')
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'appointment-1',
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      hospitalId: 'hospital-1',
      appointmentDate: new Date('2024-01-15'),
      startTime: '10:00',
      endTime: '10:30',
      status: 'completed',
      consultationFee: 200,
      symptoms: 'Chest pain, shortness of breath',
      diagnosis: 'Mild angina, requires monitoring',
      prescription: 'Aspirin 81mg daily, follow-up in 2 weeks',
      createdAt: new Date('2024-01-10')
    }
  ]);

  const [revenues, setRevenues] = useState<Revenue[]>([
    {
      id: 'revenue-1',
      hospitalId: 'hospital-1',
      doctorId: 'doctor-1',
      month: 1,
      year: 2024,
      totalConsultations: 45,
      totalRevenue: 9000,
      hospitalShare: 2700,
      doctorShare: 6300,
      departmentBreakdown: [{
        departmentId: 'dept-1',
        revenue: 9000,
        consultations: 45
      }]
    }
  ]);

  const addHospital = (hospital: Omit<Hospital, 'id' | 'createdAt'>) => {
    const newHospital: Hospital = {
      ...hospital,
      id: `hospital-${Date.now()}`,
      createdAt: new Date()
    };
    setHospitals(prev => [...prev, newHospital]);
  };

  const addDoctor = (doctor: Omit<Doctor, 'id' | 'totalEarnings'>) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: `doctor-${Date.now()}`,
      totalEarnings: 0
    };
    setDoctors(prev => [...prev, newDoctor]);
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'registrationDate'>) => {
    const newPatient: Patient = {
      ...patient,
      id: `patient-${Date.now()}`,
      registrationDate: new Date()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
      createdAt: new Date()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  const value = {
    hospitals,
    doctors,
    patients,
    appointments,
    revenues,
    addHospital,
    addDoctor,
    addPatient,
    addAppointment,
    updateAppointment
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
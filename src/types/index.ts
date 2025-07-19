export interface Hospital {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  establishedYear: number;
  totalBeds: number;
  departments: Department[];
  createdAt: Date;
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  description: string;
  headDoctorId?: string;
  specializations: string[];
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  specialization: string;
  yearsOfExperience: number;
  qualification: string;
  licenseNumber: string;
  hospitalAffiliations: HospitalAffiliation[];
  availabilitySlots: AvailabilitySlot[];
  consultationFees: ConsultationFee[];
  totalEarnings: number;
}

export interface HospitalAffiliation {
  hospitalId: string;
  departmentId: string;
  joinDate: Date;
  isActive: boolean;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  hospitalId: string;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  startTime: string; // HH:MM format
  endTime: string;
  slotDuration: number; // minutes
  isActive: boolean;
}

export interface ConsultationFee {
  id: string;
  doctorId: string;
  hospitalId: string;
  amount: number;
  hospitalShare: number; // percentage
  doctorShare: number; // percentage
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  medicalHistory: string[];
  allergies: string[];
  registrationDate: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  consultationFee: number;
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: Date;
  createdAt: Date;
}

export interface ConsultationRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  consultationDate: Date;
  diagnosis: string;
  prescription: string;
  followUpInstructions: string;
  fee: number;
  hospitalRevenue: number;
  doctorRevenue: number;
}

export interface Revenue {
  id: string;
  hospitalId: string;
  doctorId?: string;
  month: number;
  year: number;
  totalConsultations: number;
  totalRevenue: number;
  hospitalShare: number;
  doctorShare: number;
  departmentBreakdown: {
    departmentId: string;
    revenue: number;
    consultations: number;
  }[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  name: string;
  hospitalId?: string;
}
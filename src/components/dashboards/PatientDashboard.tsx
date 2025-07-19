import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  FileText,
  Heart,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, isAfter, isBefore } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { patients, appointments, doctors, hospitals } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = patients.find(p => p.email === user?.email);
  const patientAppointments = appointments.filter(a => a.patientId === patient?.id);
  const upcomingAppointments = patientAppointments.filter(a => 
    isAfter(a.appointmentDate, new Date()) && a.status === 'scheduled'
  );
  const pastAppointments = patientAppointments.filter(a => 
    isBefore(a.appointmentDate, new Date()) || a.status === 'completed'
  );

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextAppointment = () => {
    return upcomingAppointments.sort((a, b) => 
      a.appointmentDate.getTime() - b.appointmentDate.getTime()
    )[0];
  };

  const nextAppointment = getNextAppointment();

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed Consultations',
      value: pastAppointments.length,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Active Prescriptions',
      value: pastAppointments.filter(a => a.prescription).length,
      icon: Heart,
      color: 'bg-purple-500'
    },
    {
      title: 'Medical Alerts',
      value: patient?.allergies.length || 0,
      icon: AlertCircle,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{patient?.name}</h1>
              </div>
              <p className="text-gray-600">Patient Dashboard</p>
            </div>
            <Link 
              to="/book-appointment"
              className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'medical-history', label: 'Medical History' },
              { id: 'profile', label: 'Profile' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Next Appointment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Appointment</h3>
                {nextAppointment ? (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(nextAppointment.appointmentDate, 'EEEE, MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {nextAppointment.startTime} - {nextAppointment.endTime}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(nextAppointment.status)}`}>
                        {nextAppointment.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {doctors.find(d => d.id === nextAppointment.doctorId)?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {hospitals.find(h => h.id === nextAppointment.hospitalId)?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">${nextAppointment.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                    <Link 
                      to="/book-appointment"
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                    >
                      Book your first appointment
                    </Link>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {pastAppointments.slice(0, 3).map((appointment) => {
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                    return (
                      <div key={appointment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 rounded-full p-2">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Consultation with {doctor?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(appointment.appointmentDate, 'MMM dd, yyyy')} at {hospital?.name}
                          </p>
                          {appointment.diagnosis && (
                            <p className="text-xs text-gray-700 mt-1">
                              Diagnosis: {appointment.diagnosis}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Health Alerts */}
            {patient?.allergies && patient.allergies.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">Medical Alerts</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-orange-800">
                        <strong>Allergies:</strong> {patient.allergies.join(', ')}
                      </p>
                      {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                        <p className="text-sm text-orange-800">
                          <strong>Medical History:</strong> {patient.medicalHistory.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
              <Link 
                to="/book-appointment"
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Book New</span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientAppointments.map((appointment) => {
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {format(appointment.appointmentDate, 'MMM dd, yyyy')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.startTime} - {appointment.endTime}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{doctor?.name}</div>
                            <div className="text-sm text-gray-500">{doctor?.specialization}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hospital?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${appointment.consultationFee}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'medical-history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Records</h3>
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => {
                      const doctor = doctors.find(d => d.id === appointment.doctorId);
                      const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                      return (
                        <div key={appointment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {format(appointment.appointmentDate, 'MMM dd, yyyy')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {doctor?.name} • {hospital?.name}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">${appointment.consultationFee}</span>
                          </div>
                          
                          {appointment.symptoms && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Symptoms: </span>
                              <span className="text-sm text-gray-600">{appointment.symptoms}</span>
                            </div>
                          )}
                          
                          {appointment.diagnosis && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Diagnosis: </span>
                              <span className="text-sm text-gray-600">{appointment.diagnosis}</span>
                            </div>
                          )}
                          
                          {appointment.prescription && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Prescription: </span>
                              <span className="text-sm text-gray-600">{appointment.prescription}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Alerts</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Allergies</p>
                      {patient?.allergies && patient.allergies.length > 0 ? (
                        <div className="space-y-1">
                          {patient.allergies.map((allergy, index) => (
                            <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No known allergies</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Medical Conditions</p>
                      {patient?.medicalHistory && patient.medicalHistory.length > 0 ? (
                        <div className="space-y-1">
                          {patient.medicalHistory.map((condition, index) => (
                            <span key={index} className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-2">
                              {condition}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No medical conditions</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Name: </span>
                      <span className="text-gray-600">{patient?.emergencyContact.name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Relationship: </span>
                      <span className="text-gray-600">{patient?.emergencyContact.relationship}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Phone: </span>
                      <span className="text-gray-600">{patient?.emergencyContact.contactNumber}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{patient?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{patient?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{patient?.contactNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <p className="text-gray-900">
                    {patient?.dateOfBirth ? format(patient.dateOfBirth, 'MMM dd, yyyy') : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <p className="text-gray-900 capitalize">{patient?.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                  <p className="text-gray-900">
                    {patient?.registrationDate ? format(patient.registrationDate, 'MMM dd, yyyy') : 'Not available'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{patient?.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
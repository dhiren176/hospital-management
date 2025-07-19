import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  TrendingUp,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, isToday, isTomorrow } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DoctorDashboard() {
  const { doctors, appointments, hospitals, revenues } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const doctor = doctors.find(d => d.id === user?.id || d.email === user?.email);
  const doctorAppointments = appointments.filter(a => a.doctorId === doctor?.id);
  const todayAppointments = doctorAppointments.filter(a => isToday(a.appointmentDate));
  const upcomingAppointments = doctorAppointments.filter(a => 
    a.appointmentDate > new Date() && a.status === 'scheduled'
  ).slice(0, 5);

  const earningsData = [
    { month: 'Jan', earnings: 8500, consultations: 34 },
    { month: 'Feb', earnings: 9200, consultations: 38 },
    { month: 'Mar', earnings: 8800, consultations: 36 },
    { month: 'Apr', earnings: 10500, consultations: 42 },
  ];

  const hospitalBreakdown = doctor?.hospitalAffiliations.map(affiliation => {
    const hospital = hospitals.find(h => h.id === affiliation.hospitalId);
    const hospitalAppointments = doctorAppointments.filter(a => a.hospitalId === affiliation.hospitalId);
    const totalEarnings = hospitalAppointments.reduce((sum, apt) => sum + (apt.consultationFee * 0.7), 0);
    
    return {
      name: hospital?.name || 'Unknown Hospital',
      appointments: hospitalAppointments.length,
      earnings: totalEarnings
    };
  }) || [];

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Monthly Earnings',
      value: `$${doctor?.totalEarnings.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Patients',
      value: new Set(doctorAppointments.map(a => a.patientId)).size,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg. Consultation',
      value: '45 min',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{doctor?.name}</h1>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span>{doctor?.specialization}</span>
            <span>•</span>
            <span>{doctor?.yearsOfExperience} years experience</span>
            <span>•</span>
            <span>{doctor?.qualification}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'earnings', label: 'Earnings' },
              { id: 'schedule', label: 'Schedule' }
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
              {/* Today's Schedule */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{appointment.startTime} - {appointment.endTime}</p>
                          <p className="text-sm text-gray-600">Patient consultation</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
                  )}
                </div>
              </div>

              {/* Hospital Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Breakdown</h3>
                <div className="space-y-4">
                  {hospitalBreakdown.map((hospital, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{hospital.name}</p>
                          <p className="text-sm text-gray-600">{hospital.appointments} appointments</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${hospital.earnings.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
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
                  {doctorAppointments.map((appointment) => {
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Patient #{appointment.patientId.slice(-4)}
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

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Earnings Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="earnings" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Earnings (This Month)</span>
                      <span className="font-bold text-2xl text-green-600">${doctor?.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average per Consultation</span>
                      <span className="font-semibold">${Math.round((doctor?.totalEarnings || 0) / Math.max(doctorAppointments.length, 1))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Consultations</span>
                      <span className="font-semibold">{doctorAppointments.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital-wise Earnings</h3>
                  <div className="space-y-3">
                    {hospitalBreakdown.map((hospital, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{hospital.name}</span>
                        <span className="font-semibold text-green-600">${hospital.earnings.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Slots</h3>
                <div className="space-y-4">
                  {doctor?.availabilitySlots.map((slot) => {
                    const hospital = hospitals.find(h => h.id === slot.hospitalId);
                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div key={slot.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{dayNames[slot.dayOfWeek]}</p>
                            <p className="text-sm text-gray-600">{hospital?.name}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            slot.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slot.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {slot.startTime} - {slot.endTime} ({slot.slotDuration} min slots)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => {
                    const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                    return (
                      <div key={appointment.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {format(appointment.appointmentDate, 'MMM dd, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600">{hospital?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.startTime}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${appointment.consultationFee}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
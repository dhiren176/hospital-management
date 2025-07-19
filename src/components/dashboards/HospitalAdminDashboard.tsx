import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function HospitalAdminDashboard() {
  const { hospitals, doctors, appointments, revenues } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const hospital = hospitals.find(h => h.id === user?.hospitalId);
  const hospitalDoctors = doctors.filter(d => 
    d.hospitalAffiliations.some(a => a.hospitalId === user?.hospitalId && a.isActive)
  );
  const hospitalAppointments = appointments.filter(a => a.hospitalId === user?.hospitalId);
  const hospitalRevenue = revenues.find(r => r.hospitalId === user?.hospitalId);

  const monthlyData = [
    { month: 'Jan', revenue: 45000, appointments: 180 },
    { month: 'Feb', revenue: 52000, appointments: 210 },
    { month: 'Mar', revenue: 48000, appointments: 195 },
    { month: 'Apr', revenue: 61000, appointments: 245 },
  ];

  const departmentData = hospital?.departments.map(dept => ({
    name: dept.name,
    value: Math.floor(Math.random() * 50) + 20,
    color: dept.name === 'Cardiology' ? '#3B82F6' : '#10B981'
  })) || [];

  const stats = [
    {
      title: 'Total Doctors',
      value: hospitalDoctors.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Monthly Appointments',
      value: hospitalAppointments.length,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Monthly Revenue',
      value: `$${hospitalRevenue?.totalRevenue.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Hospital Share',
      value: `$${hospitalRevenue?.hospitalShare.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+10%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{hospital?.name}</h1>
          </div>
          <p className="text-gray-600">Hospital Administration Dashboard</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'doctors', label: 'Doctors' },
              { id: 'revenue', label: 'Revenue Analytics' },
              { id: 'departments', label: 'Departments' }
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
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & Appointments</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Doctors Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Doctor</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hospitalDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.yearsOfExperience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${doctor.totalEarnings.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Hospital Share</span>
                      <span className="font-semibold">${hospitalRevenue?.hospitalShare.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Doctor Share</span>
                      <span className="font-semibold">${hospitalRevenue?.doctorShare.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="text-gray-900 font-medium">Total Revenue</span>
                      <span className="font-bold text-lg">${hospitalRevenue?.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                  <div className="space-y-3">
                    {hospitalRevenue?.departmentBreakdown.map((dept, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {hospital?.departments.find(d => d.id === dept.departmentId)?.name}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">${dept.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{dept.consultations} consultations</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Department</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hospital?.departments.map((department) => (
                <div key={department.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{department.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Specializations:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {department.specializations.map((spec, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Doctors:</span>
                      <span className="ml-2">
                        {hospitalDoctors.filter(d => 
                          d.hospitalAffiliations.some(a => a.departmentId === department.id)
                        ).length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
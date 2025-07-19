import React from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  Shield, 
  Database,
  Workflow,
  BarChart3,
  Brain,
  Check
} from 'lucide-react';

export default function SystemOverview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Hospital & Appointment
            <span className="text-blue-600 block">Management System</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive healthcare management platform designed for hospitals, doctors, and patients 
            with advanced scheduling, revenue tracking, and intelligent appointment management.
          </p>
        </div>
      </div>

      {/* System Architecture */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            📦 System Architecture Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend Layer</h3>
              <p className="text-gray-600">React-based responsive UI with role-based dashboards</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Workflow className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Layer</h3>
              <p className="text-gray-600">RESTful APIs with authentication and validation</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Layer</h3>
              <p className="text-gray-600">PostgreSQL with optimized schemas and relationships</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">System Flow</h4>
            <p className="text-gray-700 leading-relaxed">
              The system facilitates seamless interaction between hospitals, doctors, and patients through 
              a centralized platform. Hospitals register and manage departments, doctors associate with 
              multiple hospitals while maintaining their schedules, and patients can search and book 
              appointments across the network. Revenue sharing is automatically calculated based on 
              predefined agreements between hospitals and doctors.
            </p>
          </div>
        </div>
      </div>

      {/* Core Entity Model */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            🧠 Core Entity Relationships
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Entities</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Hospital & Department</p>
                    <p className="text-sm text-gray-600">One-to-Many relationship with departments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Doctor & Specialization</p>
                    <p className="text-sm text-gray-600">Many-to-Many with hospital affiliations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Patient & Appointment</p>
                    <p className="text-sm text-gray-600">One-to-Many appointment history</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Constraints</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-700">Doctor specialization must match department</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-700">No overlapping availability slots</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-700">Appointment slots auto-blocked when booked</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-700">Revenue sharing percentages sum to 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Roles */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            🔐 User Roles & Permissions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Hospital Admin</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Manage hospital profile and departments</li>
                <li>• Register and approve doctors</li>
                <li>• View revenue analytics</li>
                <li>• Configure consultation fees</li>
                <li>• Monitor appointment statistics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Doctor</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Manage availability across hospitals</li>
                <li>• View appointment schedule</li>
                <li>• Update consultation records</li>
                <li>• Track earnings and revenue</li>
                <li>• Manage patient follow-ups</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Patient</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Search doctors by specialization</li>
                <li>• Book and manage appointments</li>
                <li>• View consultation history</li>
                <li>• Access medical records</li>
                <li>• Receive appointment reminders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* AI Integration */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            🧠 AI Integration Opportunities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Brain className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">AI-powered optimal time slot recommendations based on doctor preferences and patient history.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <BarChart3 className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Analytics</h3>
              <p className="text-gray-600">Forecast appointment demand and suggest capacity planning for hospitals.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctor Matching</h3>
              <p className="text-gray-600">Intelligent doctor suggestions based on patient symptoms and medical history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
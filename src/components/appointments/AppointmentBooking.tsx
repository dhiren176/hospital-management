import React, { useState } from 'react';
import { Search, MapPin, Clock, User, DollarSign, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, addDays, isAfter, startOfDay } from 'date-fns';

export default function AppointmentBooking() {
  const { doctors, hospitals, addAppointment } = useData();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const specializations = Array.from(new Set(doctors.map(d => d.specialization)));
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const consultationFee = selectedDoctor.consultationFees[0]?.amount || 200;
    const hospitalId = selectedDoctor.hospitalAffiliations[0]?.hospitalId;

    const newAppointment = {
      patientId: user?.id || 'patient-1',
      doctorId: selectedDoctor.id,
      hospitalId: hospitalId,
      appointmentDate: new Date(selectedDate),
      startTime: selectedTime,
      endTime: addMinutes(selectedTime, 30),
      status: 'scheduled' as const,
      consultationFee,
      symptoms
    };

    addAppointment(newAppointment);
    setStep(3);
  };

  const addMinutes = (time: string, minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment with {selectedDoctor?.name} has been confirmed for{' '}
              {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')} at {selectedTime}.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                <p><strong>Specialization:</strong> {selectedDoctor?.specialization}</p>
                <p><strong>Date & Time:</strong> {format(new Date(selectedDate), 'MMM dd, yyyy')} at {selectedTime}</p>
                <p><strong>Consultation Fee:</strong> ${selectedDoctor?.consultationFees[0]?.amount || 200}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setStep(1);
                setSelectedDoctor(null);
                setSelectedDate('');
                setSelectedTime('');
                setSymptoms('');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Select Doctor</span>
            <span className="text-sm text-gray-600">Schedule Appointment</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
              <p className="text-gray-600">Search for doctors by name or specialization</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search doctors by name or specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map(doctor => {
                const hospital = hospitals.find(h => 
                  doctor.hospitalAffiliations.some(a => a.hospitalId === h.id && a.isActive)
                );
                return (
                  <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{doctor.yearsOfExperience} years experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{hospital?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          ${doctor.consultationFees[0]?.amount || 200} consultation
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Qualification</p>
                      <p className="text-sm text-gray-700">{doctor.qualification}</p>
                    </div>

                    <button
                      onClick={() => handleDoctorSelect(doctor)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700 mb-4"
              >
                ← Back to Doctor Selection
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Schedule with {selectedDoctor.name}
              </h1>
              <p className="text-gray-600">{selectedDoctor.specialization}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                <div className="grid grid-cols-2 gap-3">
                  {getAvailableDates().map(date => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedDate === date.toISOString().split('T')[0]
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{format(date, 'EEE')}</div>
                      <div className="text-sm text-gray-600">{format(date, 'MMM dd')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-2">
                    {generateTimeSlots().map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-md border text-sm transition-colors ${
                          selectedTime === time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Please select a date first</p>
                )}
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Describe Your Symptoms</h3>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Please describe your symptoms or reason for visit..."
              />
            </div>

            {/* Booking Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-medium">${selectedDoctor.consultationFees[0]?.amount || 200}</span>
                  </div>
                </div>
                <button
                  onClick={handleBookAppointment}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) {
      fetchAppointments();
    }
  }, [user, loading]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`/api/appointments?userId=${user._id}`);
      const data = await res.json();
      if (data.appointments) setAppointments(data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
    setLoadingData(false);
  };

  const filteredAppointments = appointments.filter(appt => {
    if (filter === 'completed') return appt.status === 'Completed';
    if (filter === 'cancelled') return appt.status === 'Cancelled';
    return true;
  });

  const stats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    upcoming: appointments.filter(a => a.status === 'Waiting' && new Date(a.appointmentTime) > new Date()).length
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-lg">
                🏥 Sahaj Swasthya
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
              <Link href="/dashboard/appointments" className="text-blue-600 font-medium">Appointments</Link>
              <Link href="/dashboard/reports" className="text-gray-700 hover:text-blue-600 font-medium">Reports</Link>
              <Link href="/dashboard/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/logout" className="text-red-600 hover:text-red-700 font-medium px-4 py-2">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          </div>
          <p className="text-gray-600 ml-7">Your visit history and upcoming bookings</p>
        </div>

        {/* Book New Appointment Button */}
        <Link href="/dashboard/book" className="block mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-medium transition shadow-md flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a New Appointment
          </div>
        </Link>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Visits</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Past Appointments</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Completed {stats.completed > 0 && `(${stats.completed})`}
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Cancelled {stats.cancelled > 0 && `(${stats.cancelled})`}
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-2">No appointments found</p>
              <p className="text-gray-500 text-sm">Book your first appointment to get started</p>
            </div>
          ) : (
            filteredAppointments.map((appt) => (
              <div key={appt._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        🏥
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{appt.department?.name || 'Department'}</h3>
                        <p className="text-gray-600">{appt.doctor?.name}</p>
                        <p className="text-sm text-gray-500">{appt.doctor?.specialization || ''}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      appt.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(appt.appointmentTime).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(appt.appointmentTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Token</p>
                      <p className="font-semibold text-blue-600">#{appt.tokenNumber}</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {appt.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-600 font-medium mb-1">Doctor's Notes</p>
                      <p className="text-sm text-gray-700">{appt.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      View doctor notes
                    </button>
                    {appt.status === 'Completed' && (
                      <Link href="/dashboard/reports" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View reports
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
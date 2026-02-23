'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [tokenData, setTokenData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, loading]);

  const fetchData = async () => {
    try {
      const tokenRes = await fetch(`/api/token/my?userId=${user._id}`);
      const tokenData = await tokenRes.json();
      if (tokenData.token) setTokenData(tokenData.token);
    } catch (error) {
      console.error('Error fetching ', error);
    }
    setLoadingData(false);
  };

  const cancelAppointment = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      const res = await fetch(`/api/token/${tokenData._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTokenData(null);
        alert('Appointment cancelled successfully');
      }
    } catch (error) {
      alert('Error cancelling appointment');
    }
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
              <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              <Link href="/dashboard/appointments" className="text-gray-700 hover:text-blue-600 font-medium">Appointments</Link>
              <Link href="/dashboard/reports" className="text-gray-700 hover:text-blue-600 font-medium">Reports</Link>
              <Link href="/dashboard/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={logout} className="text-red-600 hover:text-red-700 font-medium px-4 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Welcome back</p>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                <span className="bg-gray-100 px-2 py-1 rounded">ID: {user._id.slice(0, 8)}...</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Phone: {user.phone}</span>
                {user.insured && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">✓ Insured</span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/opd-registration" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
                Book Appointment
              </Link>
              <Link href="/dashboard/appointments" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition">
                My Appointments
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="text-blue-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-900">2</div>
            <div className="text-xs text-gray-600">Active Prescriptions</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="text-green-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-900">Jan 12</div>
            <div className="text-xs text-gray-600">Last Visit</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="text-purple-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-600">Lab Reports</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="text-red-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-900">Current</div>
            <div className="text-xs text-gray-600">Vaccinations</div>
          </div>
        </div>

        {/* Active Token Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Active Token</h2>
            <button onClick={fetchData} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {tokenData ? (
            <div className="p-6">
              {/* Token Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    🏥
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{tokenData.department?.name || 'Department'}</h3>
                    <p className="text-gray-600">{tokenData.doctor?.name || 'Doctor Name'}</p>
                    <p className="text-sm text-gray-500">{tokenData.doctor?.specialization || ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">#{tokenData.tokenNumber}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    tokenData.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                    tokenData.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {tokenData.status}
                  </span>
                </div>
              </div>

              {/* Token Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Current Stage</p>
                  <p className="font-semibold text-gray-900">{tokenData.stage}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Appointment Time</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(tokenData.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Issued</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(tokenData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Penalty Warning */}
              {tokenData.missedCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-semibold">⚠️ Missed Slots: {tokenData.missedCount}/3</p>
                  <p className="text-sm text-red-600 mt-1">
                    {tokenData.missedCount >= 3 ? 'This token will be cancelled soon.' : 'Please arrive on time for your next appointment.'}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={cancelAppointment}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
              >
                Cancel Appointment
              </button>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 font-medium">No active appointments</p>
              <Link href="/opd-registration" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition">
                Book Your First Appointment
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/book" className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium transition text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-sm">Book</div>
              </Link>
              <Link href="/dashboard/reports" className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg font-medium transition text-center">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-sm">Reports</div>
              </Link>
              <Link href="/dashboard/prescriptions" className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg font-medium transition text-center">
                <div className="text-2xl mb-1">💊</div>
                <div className="text-sm">Prescriptions</div>
              </Link>
              <Link href="/dashboard/profile" className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium transition text-center">
                <div className="text-2xl mb-1">👤</div>
                <div className="text-sm">Profile</div>
              </Link>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Reports</h3>
              <Link href="/dashboard/reports" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All →</Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    📄
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Blood Test</p>
                    <p className="text-xs text-gray-600">Feb 20, 2026</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    📄
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">X-Ray</p>
                    <p className="text-xs text-gray-600">Feb 15, 2026</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Pill, Stethoscope, FileText, Syringe } from 'lucide-react';

function PatientDashboard({ user }) {
  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const router = useRouter();

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/token/my?userId=${user._id}`);
      const data = await res.json();
      if (data.success && data.token) {
        setTokenData(data.token);
      }
    } catch (error) {
      console.error('Failed to fetch token:', error);
    } finally {
      setLoadingToken(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome card */}
      <div className="card border-l-4 border-l-blue-700">
        <p className="text-xs text-gray-400 mb-1">Welcome back</p>
        <h2
          className="text-xl font-semibold text-gray-900"
          style={{ fontFamily: 'Fraunces,serif' }}
        >
          {user.name}
        </h2>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            ID: <strong className="text-gray-800">{user._id}</strong>
          </span>
          <span>
            Phone: <strong className="text-gray-800">{user.phone}</strong>
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push('/opd-registration')}
          className="btn-primary flex-1 text-center text-base py-4"
        >
          Book an Appointment
        </button>
        <button className="btn-secondary flex-1 text-center">
          View Medical History
        </button>
      </div>

      {/* Active Token */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Active Token
        </h3>
        {loadingToken ? (
          <div className="card text-center py-8 text-gray-400 text-sm">
            Loading...
          </div>
        ) : tokenData ? (
          <div className="card border-l-4 border-l-blue-600 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-700">
                #{tokenData.tokenNumber}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  tokenData.status === 'Waiting'
                    ? 'bg-yellow-100 text-yellow-700'
                    : tokenData.status === 'InProgress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                }`}
              >
                {tokenData.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Stage</p>
                <p className="font-semibold text-gray-800">{tokenData.stage}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Appointment Time</p>
                <p className="font-semibold text-gray-800">
                  {tokenData.appointmentTime
                    ? new Date(tokenData.appointmentTime).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' }
                      )
                    : '—'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Issued: {new Date(tokenData.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="card text-center py-8 text-gray-400 text-sm">
            No active token. Book an appointment to get started.
          </div>
        )}
      </div>

      {/* Health info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { Icon: Pill, label: 'Active Prescriptions', val: '2' },
          { Icon: Stethoscope, label: 'Last Visit', val: 'Jan 12' },
          { Icon: FileText, label: 'Lab Reports', val: '3' },
          { Icon: Syringe, label: 'Vaccinations', val: 'Up to date' },
        ].map(({ Icon, label, val }) => (
          <div
            key={label}
            className="card text-center flex flex-col items-center gap-1"
          >
            <Icon size={22} className="text-blue-600" />
            <p className="text-base font-bold text-gray-900">{val}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default PatientDashboard;

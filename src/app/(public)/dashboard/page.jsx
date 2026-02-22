'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Pill, Stethoscope, FileText, Syringe } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_APPOINTMENTS = [
  {
    id: 'APT001',
    dept: 'Cardiology',
    doctor: 'Dr. Meena Rao',
    date: '2026-02-25',
    time: '10:30 AM',
    token: 'C-14',
    status: 'Confirmed',
  },
  {
    id: 'APT002',
    dept: 'Ophthalmology',
    doctor: 'Dr. Ajay Sen',
    date: '2026-03-02',
    time: '11:00 AM',
    token: 'O-07',
    status: 'Confirmed',
  },
];

const MOCK_PATIENTS = [
  {
    id: 'P001',
    name: 'Ananya Sharma',
    age: 32,
    dept: 'Cardiology',
    status: 'Waiting',
    token: 'C-01',
  },
  {
    id: 'P002',
    name: 'Rakesh Verma',
    age: 55,
    dept: 'Orthopedics',
    status: 'In Consultation',
    token: 'O-02',
  },
  {
    id: 'P003',
    name: 'Seema Patel',
    age: 28,
    dept: 'Gynaecology',
    status: 'Waiting',
    token: 'G-03',
  },
  {
    id: 'P004',
    name: 'Mohan Das',
    age: 61,
    dept: 'Cardiology',
    status: 'Done',
    token: 'C-04',
  },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const navLinks =
    user.role === 'patient'
      ? ['Home', 'Appointments', 'Reports', 'About', 'Contact']
      : [];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-700 rounded-md flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3v14M3 10h14"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            className="font-bold text-blue-700 text-base"
            style={{ fontFamily: 'Fraunces,serif' }}
          >
            Sahaj Swasthya
          </span>
        </div>

        {/* Patient nav */}
        {user.role === 'patient' && (
          <>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-700 font-medium"
                >
                  {l}
                </a>
              ))}
              <button
                onClick={onLogout}
                className="text-sm text-red-600 font-medium hover:text-red-700"
              >
                Logout
              </button>
            </nav>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {open ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </>
        )}

        {/* Staff / Admin nav */}
        {user.role !== 'patient' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.name}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-teal-100 text-teal-700'
              }`}
            >
              {user.role === 'admin' ? 'Admin' : 'Staff'}
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-red-600 font-medium hover:text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {open && user.role === 'patient' && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l}
              href="#"
              className="block text-sm text-gray-700 font-medium py-1"
            >
              {l}
            </a>
          ))}
          <button
            onClick={onLogout}
            className="block text-sm text-red-600 font-medium py-1"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Ticket Modal ─────────────────────────────────────────────────────────────

function TicketModal({ apt, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 w-full max-w-sm p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Appointment Ticket</p>
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: 'Fraunces,serif' }}
            >
              Token: <span className="text-blue-700">{apt.token}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <TicketRow label="Department" value={apt.dept} />
          <TicketRow label="Doctor" value={apt.doctor} />
          <TicketRow label="Date" value={apt.date} />
          <TicketRow label="Time" value={apt.time} />
          <TicketRow label="Status" value={apt.status} highlight />
        </div>
        <p className="mt-4 text-xs text-gray-400 text-center">
          Please arrive 15 min before your appointment.
        </p>
        <button onClick={onClose} className="btn-primary w-full mt-4">
          Close
        </button>
      </div>
    </div>
  );
}

function TicketRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-medium ${highlight ? 'text-teal-600' : 'text-gray-800'}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Patient Dashboard ────────────────────────────────────────────────────────

function PatientDashboard({ user, tokenData, createToken }) {
  const [selectedApt, setSelectedApt] = useState(null);
  const router = useRouter();

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

      {/* Token section (live business logic) */}
      {tokenData ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold mb-4">
            Your Token: #{tokenData.tokenNumber}
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Current Stage</p>
              <p className="text-lg font-bold text-blue-700">
                {tokenData.stage}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-bold text-green-700">
                {tokenData.status}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Created: {new Date(tokenData.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <h2 className="text-xl font-bold mb-4">No Active Token</h2>
          <p className="mb-6 text-gray-600">
            Start your hospital visit journey digitally.
          </p>
          <button
            onClick={createToken}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Get Appointment Now
          </button>
        </div>
      )}

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

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Upcoming Appointments
        </h3>
        {MOCK_APPOINTMENTS.length === 0 ? (
          <div className="card text-center py-8 text-gray-400 text-sm">
            No appointments scheduled.
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_APPOINTMENTS.map((apt) => (
              <button
                key={apt.id}
                onClick={() => setSelectedApt(apt)}
                className="card w-full text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {apt.dept}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{apt.doctor}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {apt.date} · {apt.time}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      {apt.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Token: {apt.token}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Tap to view ticket →
                </p>
              </button>
            ))}
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

      {selectedApt && (
        <TicketModal apt={selectedApt} onClose={() => setSelectedApt(null)} />
      )}
    </main>
  );
}

// ─── Staff Dashboard ──────────────────────────────────────────────────────────

function StaffDashboard({ user }) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="card border-l-4 border-l-teal-600">
        <p className="text-xs text-gray-400">Staff Portal</p>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: 'Fraunces,serif' }}
        >
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Cardiology · OPD Desk</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Today's OPD", val: '34' },
          { label: 'Waiting', val: '12' },
          { label: 'In Consultation', val: '1' },
          { label: 'Completed', val: '21' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-bold text-blue-700">{s.val}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Patient queue */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Patient Queue
        </h3>
        <div className="space-y-2">
          {MOCK_PATIENTS.map((p) => (
            <div
              key={p.id}
              className="card flex items-center justify-between gap-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">
                  {p.dept} · Age {p.age} · Token {p.token}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  p.status === 'Waiting'
                    ? 'bg-yellow-100 text-yellow-700'
                    : p.status === 'In Consultation'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-teal flex-1">Call Next Patient</button>
        <button className="btn-secondary flex-1">Mark Complete</button>
      </div>
    </main>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ user }) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="card border-l-4 border-l-purple-600">
        <p className="text-xs text-gray-400">Administration</p>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: 'Fraunces,serif' }}
        >
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">System Administrator</p>
      </div>

      {/* Hospital overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Patients Today', val: '148' },
          { label: 'Active Doctors', val: '24' },
          { label: 'Open Departments', val: '9' },
          { label: 'Beds Occupied', val: '62 / 80' },
          { label: 'Pending Reports', val: '17' },
          { label: 'Revenue Today', val: '₹84,200' },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-xl font-bold text-gray-900">{s.val}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Manage Staff', 'Departments', 'Reports', 'Settings'].map((a) => (
            <button
              key={a}
              className="card text-sm font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-colors text-center py-4"
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Department load */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Department Load
        </h3>
        <div className="space-y-2">
          {[
            { dept: 'Cardiology', load: 85 },
            { dept: 'Orthopaedics', load: 60 },
            { dept: 'Gynaecology', load: 45 },
            { dept: 'Ophthalmology', load: 70 },
            { dept: 'Dental', load: 30 },
          ].map((d) => (
            <div key={d.dept} className="card">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-800">{d.dept}</span>
                <span className="text-gray-500">{d.load}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    d.load > 75
                      ? 'bg-red-500'
                      : d.load > 50
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${d.load}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [tokenData, setTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const router = useRouter();

  // Fetch token only for patients
  const fetchToken = useCallback(async () => {
    if (!user || user.role !== 'patient') {
      setLoadingToken(false);
      return;
    }

    try {
      const res = await fetch(`/api/token/my?userId=${user._id}`);
      const data = await res.json();
      if (data.data) setTokenData(data.data);
    } catch (error) {
      console.error('Failed to fetch token:', error);
    } finally {
      setLoadingToken(false);
    }
  }, [user]);

  // Redirect if not logged in, otherwise fetch token
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchToken();
    }
  }, [user, loading, router, fetchToken]);

  const createToken = async () => {
    if (!user) return;

    try {
      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: user.name,
          phone: user.phone,
          userId: user._id,
        }),
      });

      const data = await res.json();

      if (data.data) {
        setTokenData(data.data);
      } else {
        alert(data.error || 'Failed to create token');
      }
    } catch (error) {
      console.error('Token creation failed:', error);
      alert('Something went wrong.');
    }
  };

  if (loading || loadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      {user.role === 'patient' && (
        <PatientDashboard
          user={user}
          tokenData={tokenData}
          createToken={createToken}
        />
      )}
      {user.role === 'staff' && <StaffDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard user={user} />}
    </div>
  );
}

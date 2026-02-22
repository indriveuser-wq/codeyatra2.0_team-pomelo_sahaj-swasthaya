import React from 'react'

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
                  className={`h-2 rounded-full ${d.load > 75 ? 'bg-red-500' : d.load > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
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

export default AdminDashboard

const { default: Row } = require("./Row");

function TicketModal({
  apt,
  onClose,
}) {
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
          <Row label="Department" value={apt.dept} />
          <Row label="Doctor" value={apt.doctor} />
          <Row label="Date" value={apt.date} />
          <Row label="Time" value={apt.time} />
          <Row label="Status" value={apt.status} highlight />
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

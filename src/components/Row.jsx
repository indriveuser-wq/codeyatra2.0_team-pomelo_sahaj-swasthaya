import React from 'react'

function Row({
  label,
  value,
  highlight,
}) {
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

export default Row

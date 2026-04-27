import React from 'react';
import { Icons } from '../../components/Icons';

export const ScheduleManager = ({
  employeeList,
  selectedEmpId,
  setSelectedEmpId,
  shiftDate,
  setShiftDate,
  shiftTime,
  setShiftTime,
  shiftUnit,
  setShiftUnit,
  handleAddShift,
  empSchedule,
  handleDeleteShift
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><Icons.Calendar className="h-5 w-5 mr-2 text-sky-600" /> Dispatch Schedule Manager</h3>
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Driver to Manage</label>
        <select
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-slate-50 font-bold"
          value={selectedEmpId}
          onChange={(e) => setSelectedEmpId(e.target.value)}
        >
          <option value="">-- Choose an Employee --</option>
          {employeeList.filter(emp => emp.role !== 'admin').map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
          ))}
        </select>
      </div>

      {selectedEmpId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Assign New Shift</h3>
            <form onSubmit={handleAddShift} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                <input type="date" required value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Shift Time</label>
                <input type="text" required placeholder="e.g., 8:00 AM - 4:00 PM or OFF" value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Unit</label>
                <input type="text" required placeholder="e.g., Tow-402" value={shiftUnit} onChange={(e) => setShiftUnit(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg">
                Save Shift
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Driver's Calendar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 text-sm">
                  <tr>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Time</th>
                    <th className="p-4 font-semibold">Unit</th>
                    <th className="p-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {empSchedule.map((shift) => (
                    <tr key={shift.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{shift.date}</td>
                      <td className="p-4 text-slate-600">{shift.time}</td>
                      <td className="p-4 font-mono text-slate-500">{shift.unit}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteShift(shift.id)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded-md">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {empSchedule.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No shifts assigned to this driver yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

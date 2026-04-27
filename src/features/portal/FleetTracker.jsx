import React from 'react';
import { Icons } from '../../components/Icons';

export const FleetTracker = ({ employeeList }) => {
  const clockedInEmployees = employeeList.filter(emp => emp.role !== 'admin' && emp.workStatus === 'Clocked In');
  const clockedOutEmployees = employeeList.filter(emp => emp.role !== 'admin' && emp.workStatus !== 'Clocked In');

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center"><Icons.Truck className="h-6 w-6 mr-2 text-sky-600" /> Live Fleet Tracker</h3>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse">Monitoring Live System</span>
      </div>

      <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-4">Clocked In (On Duty)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {clockedInEmployees.map(emp => (
          <div key={emp.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg text-slate-900">{emp.name}</h4>
              <span className="flex items-center text-green-600 font-bold text-xs uppercase"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Active</span>
            </div>
            <p className="text-sm text-gray-600 flex items-center mb-1"><Icons.Phone className="h-4 w-4 mr-1 text-slate-400" /> {emp.phone || 'No phone listed'}</p>
            <p className="text-sm text-gray-600 flex items-center">
              <Icons.Clock className="h-4 w-4 mr-1 text-slate-400" /> Punched in: {emp.lastPunch ? new Date(emp.lastPunch).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Unknown'}
            </p>
          </div>
        ))}
        {clockedInEmployees.length === 0 && (
          <div className="col-span-full p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500 font-medium">
            No drivers are currently clocked in.
          </div>
        )}
      </div>

      <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-4">Clocked Out (Off Duty)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clockedOutEmployees.map(emp => (
          <div key={emp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-700">{emp.name}</h4>
            <p className="text-xs text-gray-500 mt-1">Last punch: {emp.lastPunch ? new Date(emp.lastPunch).toLocaleDateString([], {month:'short', day:'numeric'}) : 'Never'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

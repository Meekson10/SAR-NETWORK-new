import React from 'react';
import { Icons } from '../../components/Icons';

export const AdminDashboardView = ({
  allTimeOffRequests,
  employeeList,
  adminJobs,
  adminServices,
  setAdminActiveTab
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('timeoffManager')}>
        <h3 className="font-bold text-gray-800 mb-2">Pending Time Off</h3>
        <p className="text-3xl font-black text-orange-500">
          {allTimeOffRequests.filter(r => r.status === 'Pending Approval').length}
        </p>
        <button className="mt-4 text-sm text-sky-600 font-bold">Review Requests &rarr;</button>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('fleetView')}>
        <h3 className="font-bold text-gray-800 mb-2">Active Drivers</h3>
        <p className="text-3xl font-black text-green-500">
          {employeeList.filter(emp => emp.role !== 'admin' && emp.workStatus === 'Clocked In').length} / {employeeList.filter(emp => emp.role !== 'admin').length}
        </p>
        <button className="mt-4 text-sm text-sky-600 font-bold">View Fleet Tracker &rarr;</button>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('scheduleManager')}>
        <h3 className="font-bold text-gray-800 mb-2">Fleet Schedules</h3>
        <p className="text-gray-500 text-sm mb-4">Assign shifts and trucks to drivers.</p>
        <button className="bg-sky-600 text-white py-2 px-4 rounded font-bold text-sm w-full hover:bg-sky-700 transition-colors">Manage Schedules</button>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('directory')}>
        <h3 className="font-bold text-gray-800 mb-2">HR & Employee Info</h3>
        <p className="text-gray-500 text-sm mb-4">View profiles, banking info, and create accounts.</p>
        <button className="bg-slate-900 text-white py-2 px-4 rounded font-bold text-sm w-full hover:bg-slate-800 transition-colors">Open HR Directory</button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('jobManager')}>
        <h3 className="font-bold text-gray-800 mb-2">Job Postings</h3>
        <p className="text-3xl font-black text-blue-500">
          {adminJobs.length}
        </p>
        <button className="mt-4 text-sm text-sky-600 font-bold">Manage Job Board &rarr;</button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('serviceManager')}>
        <h3 className="font-bold text-gray-800 mb-2">Service Pricing</h3>
        <p className="text-3xl font-black text-purple-500">
          {adminServices.length}
        </p>
        <button className="mt-4 text-sm text-sky-600 font-bold">Manage Services &rarr;</button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('accounting')}>
        <h3 className="font-bold text-gray-800 mb-2">Accounting & Payroll</h3>
        <p className="text-gray-500 text-sm mb-4">Sync hours to QuickBooks or Gusto.</p>
        <button className="bg-green-600 text-white py-2 px-4 rounded font-bold text-sm w-full hover:bg-green-700 transition-colors">Open Accounting Hub</button>
      </div>
    </div>
  );
};

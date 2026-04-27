import React from 'react';
import { Icons } from '../../components/Icons';

export const TimeOffManager = ({ allTimeOffRequests, handleTimeOffAction }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center"><Icons.Palmtree className="h-5 w-5 mr-2 text-sky-600" /> Time Off Approval Queue</h3>
        <p className="text-gray-500 text-sm mb-6">Review driver vacation and sick leave requests. Approving will automatically deduct from their balances (8 hrs/day).</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 text-sm">
              <tr>
                <th className="p-4 font-semibold">Driver</th>
                <th className="p-4 font-semibold">Dates</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold">Pay Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allTimeOffRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{req.userName}</td>
                  <td className="p-4 text-slate-600 font-medium">{req.startDate} to {req.endDate}</td>
                  <td className="p-4 text-slate-600">{req.reason}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">{req.payType || 'Unspecified'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'Denied' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    {req.status === 'Pending Approval' && (
                      <>
                        <button onClick={() => handleTimeOffAction(req.userId, req.id, 'Approved', req)} className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded transition-colors shadow-sm">
                          Approve
                        </button>
                        <button onClick={() => handleTimeOffAction(req.userId, req.id, 'Denied', req)} className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded transition-colors shadow-sm">
                          Deny
                        </button>
                      </>
                    )}
                    {req.status !== 'Pending Approval' && (
                      <span className="text-xs text-gray-400 font-bold uppercase">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
              {allTimeOffRequests.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No time off requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

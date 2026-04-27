import React from 'react';
import { Icons } from '../../components/Icons';

export const JobManager = ({
  adminJobs,
  newJobTitle,
  setNewJobTitle,
  newJobType,
  setNewJobType,
  newJobLoc,
  setNewJobLoc,
  newJobPay,
  setNewJobPay,
  newJobDesc,
  setNewJobDesc,
  handleAddJob,
  handleDeleteJob
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center"><Icons.Briefcase className="h-5 w-5 mr-2 text-sky-600" /> Public Job Board Manager</h3>
        <p className="text-gray-500 text-sm mb-6">Jobs posted here will instantly appear on the public Careers page.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
            <h4 className="font-bold text-slate-800 mb-4">Post New Opening</h4>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                <input required type="text" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. Tow Truck Operator" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Employment Type</label>
                <select value={newJobType} onChange={(e) => setNewJobType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                <input required type="text" value={newJobLoc} onChange={(e) => setNewJobLoc(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. Newark Area" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Pay Rate</label>
                <input required type="text" value={newJobPay} onChange={(e) => setNewJobPay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. $25-35/hr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Description</label>
                <textarea required rows={3} value={newJobDesc} onChange={(e) => setNewJobDesc(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Briefly describe responsibilities..."></textarea>
              </div>
              <button type="submit" className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 transition-colors">
                Post Job
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Job Title</th>
                  <th className="p-4 font-semibold">Type & Loc</th>
                  <th className="p-4 font-semibold">Pay Rate</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adminJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{job.title}</td>
                    <td className="p-4 text-slate-600 text-sm">{job.type} • {job.loc}</td>
                    <td className="p-4 text-green-600 font-bold">{job.pay}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteJob(job.id)} className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {adminJobs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No jobs currently posted to the public site.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

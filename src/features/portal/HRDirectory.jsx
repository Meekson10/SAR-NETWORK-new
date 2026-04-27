import React from 'react';
import { Icons } from '../../components/Icons';

export const HRDirectory = ({
  employeeList,
  createMessage,
  handleCreateEmployee,
  newEmpName,
  setNewEmpName,
  newEmpEmail,
  setNewEmpEmail,
  newEmpPassword,
  setNewEmpPassword,
  isCreatingUser,
  expandedEmpId,
  setExpandedEmpId,
  user,
  handleToggleEmployeeStatus,
  handleDeleteEmployee,
  handlePasswordReset
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><Icons.User className="h-5 w-5 mr-2 text-sky-600" /> Add New Employee</h3>
        
        {createMessage && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-semibold border ${createMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            {createMessage.text}
          </div>
        )}

        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input required type="text" value={newEmpName} onChange={(e) => setNewEmpName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input required type="email" value={newEmpEmail} onChange={(e) => setNewEmpEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="driver@sarnetwork.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Temporary Password</label>
            <input required type="password" value={newEmpPassword} onChange={(e) => setNewEmpPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Min 6 characters" />
          </div>
          <button disabled={isCreatingUser} type="submit" className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 transition-colors disabled:opacity-50">
            {isCreatingUser ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>

      <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Secure Employee Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 text-sm">
              <tr>
                <th className="p-4 font-semibold">Name / Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Account Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employeeList.map((emp) => (
                <React.Fragment key={emp.id}>
                  <tr className={`transition-colors ${expandedEmpId === emp.id ? 'bg-sky-50' : 'hover:bg-slate-50'}`}>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{emp.name || 'Admin User'}</div>
                      <div className="text-slate-500 text-sm">{emp.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                        {emp.role || 'employee'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {emp.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => setExpandedEmpId(expandedEmpId === emp.id ? null : emp.id)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200 px-3 py-1.5 rounded transition-colors"
                      >
                        {expandedEmpId === emp.id ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      {emp.id !== user.uid && (
                        <>
                          <button 
                            onClick={() => handleToggleEmployeeStatus(emp.id, emp.status || 'Active')}
                            className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-2 py-1.5 rounded transition-colors"
                          >
                            {emp.status === 'Active' ? 'Disable' : 'Enable'}
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1.5 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  
                  {/* EXPANDABLE HR DETAILS ROW */}
                  {expandedEmpId === emp.id && (
                    <tr className="bg-slate-50 border-b-2 border-slate-200 shadow-inner">
                      <td colSpan="4" className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-3 flex items-center"><Icons.Clock className="h-4 w-4 mr-1"/> Hours & Balances</h5>
                            <p className="mb-1"><strong className="text-slate-700">Total Hours:</strong> {emp.hoursWorked || '0.00'}</p>
                            <p className="mb-1"><strong className="text-slate-700">PTO Earned:</strong> {emp.ptoEarned || '0.00'}</p>
                            <p><strong className="text-slate-700">Sick Avail:</strong> {emp.sickEarned || '24.00'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-3 flex items-center"><Icons.MapPin className="h-4 w-4 mr-1"/> Contact Info</h5>
                            <p className="mb-1"><strong className="text-slate-700">Phone:</strong> {emp.phone || 'Not provided'}</p>
                            <p><strong className="text-slate-700">Address:</strong> {emp.address || 'Not provided'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-3 flex items-center"><Icons.CreditCard className="h-4 w-4 mr-1"/> Direct Deposit</h5>
                            <p className="mb-1"><strong className="text-slate-700">Routing:</strong> {emp.banking?.routing ? `*****${emp.banking.routing.slice(-4)}` : 'Not provided'}</p>
                            <p><strong className="text-slate-700">Account:</strong> {emp.banking?.account ? `*****${emp.banking.account.slice(-4)}` : 'Not provided'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
                            <h5 className="font-bold text-slate-500 uppercase tracking-wider text-xs mb-3 flex items-center"><Icons.Shield className="h-4 w-4 mr-1"/> Account Recovery</h5>
                            <button onClick={() => handlePasswordReset(emp.email)} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition-colors">
                              Send Password Reset
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {employeeList.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">Loading employee directory...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

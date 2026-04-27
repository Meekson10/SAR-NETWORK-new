import React from 'react';
import { Icons } from '../../components/Icons';

export const EmployeeProfile = ({
  profileStatus,
  handleUpdateProfile,
  profileAddress,
  setProfileAddress,
  profilePhone,
  setProfilePhone,
  profileRouting,
  setProfileRouting,
  profileAccount,
  setProfileAccount
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Personal & Banking Info</h3>
      
      <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl">
        {profileStatus === 'saved' && <div className="bg-green-50 text-green-700 p-3 rounded-lg font-bold border border-green-200">Profile updated securely!</div>}
        
        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-700 flex items-center"><Icons.MapPin className="h-5 w-5 mr-2 text-sky-600"/> Contact Information</h4>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mailing Address</label>
            <input type="text" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} placeholder="123 Main St, Apt 4B, City, State, ZIP" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="(555) 123-4567" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>

        {/* Banking Info */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h4 className="text-lg font-bold text-slate-700 flex items-center"><Icons.CreditCard className="h-5 w-5 mr-2 text-sky-600"/> Direct Deposit Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Routing Number</label>
              <input type="password" value={profileRouting} onChange={(e) => setProfileRouting(e.target.value)} placeholder="•••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
              <input type="password" value={profileAccount} onChange={(e) => setProfileAccount(e.target.value)} placeholder="••••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 font-medium"><Icons.Shield className="h-3 w-3 inline mr-1" /> Banking information is encrypted and securely saved to Firebase.</p>
        </div>

        <button type="submit" disabled={profileStatus === 'saving'} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center">
          <Icons.Save className="h-5 w-5 mr-2" /> {profileStatus === 'saving' ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};

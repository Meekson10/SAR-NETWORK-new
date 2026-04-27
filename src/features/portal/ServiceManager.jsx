import React from 'react';
import { Icons } from '../../components/Icons';

export const ServiceManager = ({
  adminServices,
  newServiceLabel,
  setNewServiceLabel,
  newServicePrice,
  setNewServicePrice,
  newServiceIcon,
  setNewServiceIcon,
  handleAddService,
  handleEditServicePrice,
  handleDeleteService
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center"><Icons.Wrench className="h-5 w-5 mr-2 text-sky-600" /> Public Service Pricing Engine</h3>
            <p className="text-gray-500 text-sm mt-1">Manage the services and base prices shown on the public "Service Request" form.</p>
          </div>
          <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full">{adminServices.length} Active Services</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
            <h4 className="font-bold text-slate-800 mb-4">Add New Service</h4>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Service Label</label>
                <input required type="text" value={newServiceLabel} onChange={(e) => setNewServiceLabel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. Heavy Duty Towing" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Base Price ($)</label>
                <input required type="number" min="0" step="1" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. 150" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Icon Type</label>
                <select value={newServiceIcon} onChange={(e) => setNewServiceIcon(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                  <option value="Truck">Tow Truck</option>
                  <option value="Tool">Wrench / Tool</option>
                  <option value="Battery">Battery</option>
                  <option value="Key">Lockout Key</option>
                  <option value="Gas">Fuel Pump</option>
                  <option value="Tire">Tire / Wheel</option>
                  <option value="Shield">Shield</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                Save Service
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminServices.map((svc) => {
                const IconComponent = Icons[svc.icon] || Icons.Wrench;
                return (
                  <div key={svc.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative">
                    <button 
                      onClick={() => handleDeleteService(svc.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Service"
                    >
                      <Icons.Trash className="h-5 w-5" />
                    </button>
                    <div className="flex items-center mb-4">
                      <div className="bg-sky-100 p-3 rounded-lg mr-4">
                        <IconComponent className="h-6 w-6 text-sky-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{svc.label}</h4>
                        <p className="text-xs text-gray-500 font-mono text-uppercase">ID: {svc.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <span className="text-sm font-bold text-slate-600">Base Price:</span>
                      <div className="flex items-center">
                        <span className="text-slate-500 mr-1">$</span>
                        <input 
                          type="number" 
                          defaultValue={svc.price}
                          onBlur={(e) => handleEditServicePrice(svc.id, e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded font-bold text-right focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {adminServices.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <Icons.Wrench className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No services defined</h3>
                <p className="text-gray-500 text-sm">Add a service using the form to populate the public request form.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

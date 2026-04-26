import React from 'react';
import { Link } from 'react-router-dom';
import { SarLogo } from './Icons';

const Footer = () => (
  <footer className="bg-slate-900 text-white border-t border-slate-800">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center mb-4">
           <SarLogo className="h-10 w-10 mr-3" />
           <span className="text-2xl font-black tracking-tighter">SAR<span className="text-sky-500">NETWORK</span></span>
        </div>
        <p className="text-gray-400 max-w-sm">
          Leading the way in rapid roadside recovery. We are committed to safety, speed, and superior service.
        </p>
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li><Link to="/services" className="text-gray-400 hover:text-white">Request Service</Link></li>
          <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
          <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
          <li><Link to="/employee" className="text-gray-400 hover:text-white">Employee Login</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Legal</h4>
        <ul className="space-y-2">
          <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
          <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-800 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} SAR Network. All rights reserved.
    </div>
  </footer>
);

export default Footer;

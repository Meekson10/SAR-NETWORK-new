import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons, SarLogo } from './Icons';

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const activePage = location.pathname.substring(1) || 'home';

  const navItems = [
    { id: 'home', path: '/', label: 'Home' },
    { id: 'about', path: '/about', label: 'About Us' },
    { id: 'services', path: '/services', label: 'Request Service' },
    { id: 'careers', path: '/careers', label: 'Careers' },
    { id: 'contact', path: '/contact', label: 'Contact' },
    { id: 'employee', path: '/employee', label: 'Employee Portal' },
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg border-b-4 border-sky-500 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center cursor-pointer group">
            <div className="bg-white p-1 rounded-full mr-3 group-hover:scale-105 transition-transform">
              <SarLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none">SAR</span>
              <span className="text-sky-400 font-bold tracking-widest text-sm leading-none">NETWORK</span>
            </div>
          </Link>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activePage === item.id || (item.id === 'home' && location.pathname === '/')
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <Icons.X className="h-6 w-6" /> : <Icons.Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activePage === item.id || (item.id === 'home' && location.pathname === '/')
                    ? 'bg-sky-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

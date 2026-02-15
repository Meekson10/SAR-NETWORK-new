import React, { useState, useEffect } from 'react';

// --- BUILT-IN ICONS (No Installation Required) ---
const IconWrapper = ({ children, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

const Icons = {
  Phone: (p) => <IconWrapper {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></IconWrapper>,
  MapPin: (p) => <IconWrapper {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></IconWrapper>,
  Clock: (p) => <IconWrapper {...p}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></IconWrapper>,
  Briefcase: (p) => <IconWrapper {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></IconWrapper>,
  Menu: (p) => <IconWrapper {...p}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></IconWrapper>,
  X: (p) => <IconWrapper {...p}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></IconWrapper>,
  CheckCircle: (p) => <IconWrapper {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>,
  AlertTriangle: (p) => <IconWrapper {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></IconWrapper>,
  Truck: (p) => <IconWrapper {...p}><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></IconWrapper>,
  Key: (p) => <IconWrapper {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></IconWrapper>,
  Battery: (p) => <IconWrapper {...p}><rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line></IconWrapper>,
  Fuel: (p) => <IconWrapper {...p}><line x1="3" y1="22" x2="15" y2="22"></line><line x1="5" y1="17" x2="5" y2="11"></line><path d="M11 17l-5-5"></path><path d="M14 12h-2v9"></path><path d="M4 11V5a3 3 0 0 1 3-3 2 2 0 0 1 2 2v2"></path><path d="M18 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path><path d="M18 14v-4a2 2 0 0 0-2-2h-3"></path></IconWrapper>,
  User: (p) => <IconWrapper {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></IconWrapper>,
  LogOut: (p) => <IconWrapper {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></IconWrapper>,
  ChevronRight: (p) => <IconWrapper {...p}><polyline points="9 18 15 12 9 6"></polyline></IconWrapper>,
  Star: (p) => <IconWrapper {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></IconWrapper>,
  Shield: (p) => <IconWrapper {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></IconWrapper>,
  Users: (p) => <IconWrapper {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></IconWrapper>,
  History: (p) => <IconWrapper {...p}><path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><path d="M12 7v5l3 3"></path></IconWrapper>,
  Upload: (p) => <IconWrapper {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></IconWrapper>,
  ArrowLeft: (p) => <IconWrapper {...p}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></IconWrapper>,
  Calendar: (p) => <IconWrapper {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconWrapper>,
  CreditCard: (p) => <IconWrapper {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></IconWrapper>,
  Palmtree: (p) => <IconWrapper {...p}><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2c0-1.66 1.57-3 3.5-3S11 6.34 11 8h2z"></path><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-2c0-1.66-1.57-3-3.5-3s-3.5 1.34-3.5 3c0 .2.02.4.05.58"></path><path d="M5.8 9.51A4.09 4.09 0 0 1 8.5 9c2.21 0 4 1.79 4 4h-2c0-1.1-.9-2-2-2s-2 .9-2 2H4.7c0-1.39.42-2.68 1.1-3.49"></path><path d="M18 22h-6.5a2 2 0 0 1-2-2v-7"></path><path d="M13 13.06A4.55 4.55 0 0 1 15.5 13c2.21 0 4 1.79 4 4h-2c0-1.1-.9-2-2-2a2 2 0 0 0-2 2h-2.5c0-1.64.6-3.16 1.6-4.14"></path></IconWrapper>,
  Thermometer: (p) => <IconWrapper {...p}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></IconWrapper>,
  Save: (p) => <IconWrapper {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></IconWrapper>
};

// --- Custom Logo Component ---
const SarLogo = ({ className = "h-12 w-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Globe Wireframe */}
    <circle cx="50" cy="50" r="40" stroke="#2C3E50" strokeWidth="6" />
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M50 10 V90" stroke="#2C3E50" strokeWidth="4" />
    <path d="M20 30 Q50 30 80 30" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M20 70 Q50 70 80 70" stroke="#2C3E50" strokeWidth="4" fill="none" />
    
    {/* Blue Swoosh */}
    <path 
      d="M15 75 Q 40 95 90 45 Q 60 90 15 75 Z" 
      fill="#0EA5E9" 
    />
  </svg>
);

// --- Components ---

const Navigation = ({ activePage, setActivePage, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Request Service' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' },
    { id: 'employee', label: 'Employee Portal' },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b-4 border-sky-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => setActivePage('home')}
          >
            <div className="bg-white p-1 rounded-full mr-3 group-hover:scale-105 transition-transform">
              <SarLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none">SAR</span>
              <span className="text-sky-400 font-bold tracking-widest text-sm leading-none">NETWORK</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activePage === item.id
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activePage === item.id
                    ? 'bg-sky-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const HomePage = ({ setActivePage }) => (
  <div className="flex flex-col">
    {/* Hero Section */}
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center min-h-[600px]">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
          Stranded? <br />
          <span className="text-sky-500">We've Got You.</span>
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl mb-8">
          SAR Network provides 24/7 rapid response towing and roadside assistance. 
          Trusted by thousands of drivers nationwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setActivePage('services')}
            className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-sky-600 hover:bg-sky-700 md:py-4 md:text-xl shadow-lg shadow-sky-900/50 transition-all hover:-translate-y-1"
          >
            <Icons.AlertTriangle className="mr-2 h-6 w-6" />
            Request Help Now
          </button>
          <button 
            onClick={() => setActivePage('contact')}
            className="flex items-center justify-center px-8 py-4 border-2 border-slate-600 text-lg font-bold rounded-full text-gray-200 hover:bg-slate-800 hover:border-slate-500 md:py-4 md:text-xl transition-all"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>

    {/* Features Grid */}
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Why Choose SAR Network?
          </h2>
          <p className="mt-4 text-xl text-gray-500">Professional service, transparent pricing, and rapid arrival times.</p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {[
            { icon: Icons.Clock, title: "24/7 Availability", text: "Day or night, rain or shine, our dispatch team is ready to take your call." },
            { icon: Icons.MapPin, title: "Nationwide Coverage", text: "Our extensive network ensures we can reach you wherever you break down." },
            { icon: Icons.CheckCircle, title: "Certified Professionals", text: "All our operators are licensed, insured, and rigorously trained." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-12 w-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="bg-white">
    {/* About Hero */}
    <div className="bg-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Our Story & Mission</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Built on a foundation of trust, speed, and safety, SAR Network has evolved from a single truck operation into the nation's most reliable roadside recovery partner.
        </p>
      </div>
    </div>

    {/* History Section */}
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
            <div className="flex items-center mb-4">
                <Icons.History className="text-sky-600 h-8 w-8 mr-3"/>
                <h2 className="text-3xl font-bold text-slate-900">Our History</h2>
            </div>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              Founded in 2005, <strong>SAR Network</strong> began with a simple mission: to provide honest, reliable help to stranded motorists who felt vulnerable on the side of the road. What started as a family-run business with just two tow trucks in New Jersey has grown into a comprehensive logistical network.
            </p>
            <p className="mb-4">
              Over the last two decades, we have invested heavily in technology to reduce wait times. In 2015, we launched our proprietary dispatch system, allowing us to route the nearest driver to a breakdown site instantly.
            </p>
            <p>
              Today, SAR Network partners with major insurance providers and manages a fleet of over 500 certified independent operators across the country. Despite our growth, we never lost sight of our roots: treating every customer like a family member in need.
            </p>
          </div>
        </div>
        <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner">
          <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-300 pb-2">Milestones</h3>
          <ul className="space-y-6">
            <li className="flex">
              <span className="font-bold text-sky-600 w-24 shrink-0">2005</span>
              <span className="text-gray-700">Company founded in Maplewood, NJ.</span>
            </li>
            <li className="flex">
              <span className="font-bold text-sky-600 w-24 shrink-0">2010</span>
              <span className="text-gray-700">Expanded to Tri-State area coverage.</span>
            </li>
            <li className="flex">
              <span className="font-bold text-sky-600 w-24 shrink-0">2015</span>
              <span className="text-gray-700">Launched Digital Dispatch System 1.0.</span>
            </li>
            <li className="flex">
              <span className="font-bold text-sky-600 w-24 shrink-0">2023</span>
              <span className="text-gray-700">Rebranded to SAR Network; achieved 98% satisfaction rating.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Reliability Stats */}
    <div className="bg-sky-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Unmatched Reliability</h2>
            <p className="text-gray-600 mt-2">The numbers speak for themselves.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-sky-600 mb-2 flex justify-center"><Icons.Clock className="h-8 w-8"/></div>
                <div className="text-3xl font-black text-slate-900">22m</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Avg. Arrival</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-sky-600 mb-2 flex justify-center"><Icons.CheckCircle className="h-8 w-8"/></div>
                <div className="text-3xl font-black text-slate-900">99.8%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Job Success</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-sky-600 mb-2 flex justify-center"><Icons.Users className="h-8 w-8"/></div>
                <div className="text-3xl font-black text-slate-900">50k+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Drivers Helped</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-sky-600 mb-2 flex justify-center"><Icons.Shield className="h-8 w-8"/></div>
                <div className="text-3xl font-black text-slate-900">100%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Insured</div>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const ServiceRequestPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ type: '', location: '', phone: '', vehicle: '' });

  const services = [
    { id: 'tow', label: 'Towing', icon: Icons.Truck },
    { id: 'flat', label: 'Flat Tire', icon: Icons.AlertTriangle },
    { id: 'lockout', label: 'Lockout', icon: Icons.Key },
    { id: 'battery', label: 'Dead Battery', icon: Icons.Battery },
    { id: 'fuel', label: 'Out of Gas', icon: Icons.Fuel },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-green-50 rounded-2xl text-center border border-green-200">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Help is on the way!</h2>
        <p className="text-green-700 mb-6">Ticket #SAR-9921 created.</p>
        <div className="bg-white p-4 rounded-lg shadow-sm text-left mb-6">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">ETA</p>
          <p className="text-3xl font-black text-slate-800">15-20 Mins</p>
        </div>
        <p className="text-sm text-gray-500">A dispatcher will call you shortly at {formData.phone}</p>
        <button 
          onClick={() => { setSubmitted(false); setStep(1); }}
          className="mt-6 text-green-700 font-semibold hover:underline"
        >
          Start New Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Request Assistance</h2>
        <p className="text-gray-600 mt-2">Tell us what happened so we can send the right truck.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <span className="font-semibold text-slate-700">Step {step} of 3</span>
          <div className="flex space-x-2">
            <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-sky-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-sky-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-8 rounded-full ${step >= 3 ? 'bg-sky-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setFormData({...formData, type: s.label}); setStep(2); }}
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all group"
                >
                  <s.icon className="h-8 w-8 text-slate-400 group-hover:text-sky-600 mb-3" />
                  <span className="font-semibold text-slate-700 group-hover:text-sky-700">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Location</label>
                <div className="relative">
                  <Icons.MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="123 Highway Rd, Exit 4..." 
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <button className="mt-2 text-sky-600 text-sm font-medium flex items-center hover:text-sky-700">
                  <Icons.MapPin className="h-3 w-3 mr-1" /> Use current location
                </button>
              </div>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.location}
                className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
              <button onClick={() => setStep(1)} className="w-full text-slate-500 font-medium">Back</button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Details</label>
                <input 
                  required
                  type="text" 
                  placeholder="2018 Toyota Camry (Silver)" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  placeholder="(555) 123-4567" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="bg-sky-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sky-900 mb-2">Summary</h4>
                <p className="text-sm text-sky-800">Service: <span className="font-medium">{formData.type}</span></p>
                <p className="text-sm text-sky-800">Location: <span className="font-medium">{formData.location}</span></p>
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-200"
              >
                Confirm Request
              </button>
              <button type="button" onClick={() => setStep(2)} className="w-full text-slate-500 font-medium">Back</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const EmployeePortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);
  const [shiftDuration, setShiftDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileData, setProfileData] = useState({
    name: "Mike Rodriguez",
    email: "mike.r@sarnetwork.com",
    phone: "(555) 019-2834",
    bankName: "Chase Bank",
    routing: "********9823",
    account: "********1234"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isClockedIn && isLoggedIn) {
      interval = setInterval(() => {
        setShiftDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isLoggedIn]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    alert("Profile information updated successfully.");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6">
            <SarLogo className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Employee Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Employee ID</label>
              <input type="text" className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="SAR-XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
            </div>
            <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
              Access Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Portal Tabs Renderers ---

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Clock In/Out Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <div className={`text-6xl font-mono mb-4 tracking-wider ${isClockedIn ? 'text-sky-600' : 'text-slate-300'}`}>
          {formatTime(shiftDuration)}
        </div>
        <p className="text-gray-500 mb-8 font-medium">
          {isClockedIn ? `Started at ${clockTime}` : 'Not currently on shift'}
        </p>
        
        <button
          onClick={() => {
            if (!isClockedIn) {
              setClockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              setIsClockedIn(true);
            } else {
              if(confirm("Confirm end of shift?")) {
                  setIsClockedIn(false);
                  setShiftDuration(0);
                  setClockTime(null);
              }
            }
          }}
          className={`w-full max-w-xs py-4 rounded-full font-bold text-xl shadow-lg transition-all transform active:scale-95 ${
            isClockedIn 
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' 
              : 'bg-green-500 text-white hover:bg-green-600 shadow-green-200'
          }`}
        >
          {isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
        </button>
      </div>

      {/* Status & Assignments */}
      <div className="space-y-6">
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Icons.Star className="h-5 w-5 text-yellow-400 mr-2" />
            Active Assignment
          </h3>
          {isClockedIn ? (
            <div className="bg-slate-700/50 p-4 rounded-xl">
              <p className="text-sm text-slate-400 uppercase font-bold mb-1">Status: En Route</p>
              <p className="text-xl font-semibold">2015 Honda Civic (Flat)</p>
              <p className="text-slate-300 mt-2 flex items-start">
                <Icons.MapPin className="h-5 w-5 mr-2 shrink-0 text-sky-400" />
                I-95 South, Mile Marker 42
              </p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-green-600 py-2 rounded-lg text-sm font-bold">Arrived</button>
                <button className="flex-1 bg-slate-600 py-2 rounded-lg text-sm font-bold">Details</button>
              </div>
            </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <p>Clock in to receive assignments</p>
              </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-slate-900 mb-4">Quick Stats (This Week)</h3>
          <ul className="space-y-3">
            <li className="flex justify-between text-sm">
              <span className="text-gray-600">Hours Worked</span>
              <span className="font-mono font-medium">32h 15m</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-gray-600">Jobs Completed</span>
              <span className="font-mono font-medium">14</span>
            </li>
             <li className="flex justify-between text-sm">
              <span className="text-gray-600">Customer Rating</span>
              <span className="font-mono font-medium text-green-600">4.9/5.0</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Your Schedule</h3>
        <span className="text-sm text-gray-500">Nov 20 - Nov 26</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Shift</th>
              <th className="p-4 font-semibold">Unit</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { date: "Mon, Nov 20", shift: "08:00 AM - 04:00 PM", unit: "Tow-402", status: "Completed" },
              { date: "Tue, Nov 21", shift: "08:00 AM - 04:00 PM", unit: "Tow-402", status: "Completed" },
              { date: "Wed, Nov 22", shift: "08:00 AM - 04:00 PM", unit: "Tow-402", status: "Active" },
              { date: "Thu, Nov 23", shift: "OFF", unit: "-", status: "-" },
              { date: "Fri, Nov 24", shift: "08:00 AM - 04:00 PM", unit: "Tow-405", status: "Scheduled" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{row.date}</td>
                <td className="p-4 text-slate-600">{row.shift}</td>
                <td className="p-4 text-slate-600">{row.unit}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    row.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    row.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                    row.status === 'OFF' ? 'bg-gray-100 text-gray-500' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTimeOff = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-xl mr-4">
            <Icons.Thermometer className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Sick Hours Available</p>
            <p className="text-2xl font-black text-slate-900">42 hrs</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-teal-100 text-teal-600 rounded-xl mr-4">
            <Icons.Palmtree className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Vacation Available</p>
            <p className="text-2xl font-black text-slate-900">86 hrs</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Request Time Off</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert("Request submitted for approval."); }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
              <option>Vacation</option>
              <option>Sick Leave</option>
              <option>Personal Day</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Dates</label>
             <input type="text" placeholder="MM/DD/YYYY - MM/DD/YYYY" className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
            <textarea rows={2} className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
          </div>
          <button className="bg-slate-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-xl font-bold text-slate-900">Personal & Banking Info</h3>
        {!isEditingProfile ? (
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="text-sky-600 font-bold text-sm hover:underline"
          >
            Edit Information
          </button>
        ) : (
          <button 
            onClick={() => setIsEditingProfile(false)}
            className="text-gray-500 font-bold text-sm hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
      
      <form onSubmit={handleProfileSave} className="p-8 space-y-8">
        {/* Personal Details */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <Icons.User className="h-4 w-4 mr-2" /> Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
              <input 
                disabled={!isEditingProfile}
                type="text" 
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-slate-100 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input 
                disabled={!isEditingProfile}
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-slate-100 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
              <input 
                disabled={!isEditingProfile}
                type="text" 
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-slate-100 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div>
           <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <Icons.CreditCard className="h-4 w-4 mr-2" /> Banking Information (Direct Deposit)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</label>
              <input 
                disabled={!isEditingProfile}
                type="text" 
                value={profileData.bankName}
                onChange={(e) => setProfileData({...profileData, bankName: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            <div className="hidden md:block"></div> {/* Spacer */}
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Routing Number</label>
              <input 
                disabled={!isEditingProfile}
                type="text" 
                value={profileData.routing}
                onChange={(e) => setProfileData({...profileData, routing: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white disabled:bg-gray-100 disabled:text-gray-500 font-mono"
              />
            </div>
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
              <input 
                disabled={!isEditingProfile}
                type="text" 
                value={profileData.account}
                onChange={(e) => setProfileData({...profileData, account: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white disabled:bg-gray-100 disabled:text-gray-500 font-mono"
              />
            </div>
          </div>
        </div>

        {isEditingProfile && (
          <div className="flex justify-end pt-4">
            <button className="flex items-center bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 shadow-lg shadow-green-200 transition-colors">
              <Icons.Save className="h-5 w-5 mr-2" /> Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl mr-4">
            MR
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome back, {profileData.name.split(' ')[0]}</h2>
            <p className="text-gray-500 text-sm">Unit: Tow-402 • Shift: Day</p>
          </div>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <Icons.LogOut className="h-5 w-5 mr-2" /> Sign Out
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Icons.Clock },
          { id: 'schedule', label: 'Schedule', icon: Icons.Calendar },
          { id: 'timeoff', label: 'Time Off', icon: Icons.Palmtree },
          { id: 'profile', label: 'My Profile & Banking', icon: Icons.User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'timeoff' && renderTimeOff()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('idle'); // idle, submitting, success

  const jobs = [
    { title: "Tow Truck Operator", type: "Full-time", loc: "Newark Area", pay: "$25-35/hr" },
    { title: "Dispatch Coordinator", type: "Full-time", loc: "Remote/Hybrid", pay: "$20-28/hr" },
    { title: "Roadside Technician", type: "Part-time", loc: "Jersey City", pay: "$22-30/hr" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setApplicationStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setApplicationStatus('success');
      window.scrollTo(0, 0);
    }, 1500);
  };

  if (applicationStatus === 'success') {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-green-50 p-8 rounded-2xl text-center border border-green-200 shadow-sm">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Application Received!</h2>
          <p className="text-green-700 mb-6">
            Thanks for applying to the <span className="font-bold">{selectedJob?.title}</span> position. 
            Our hiring team will review your info and reach out within 3-5 business days.
          </p>
          <button 
            onClick={() => { setSelectedJob(null); setApplicationStatus('idle'); }}
            className="text-green-700 font-bold hover:underline"
          >
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  if (selectedJob) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <button 
          onClick={() => setSelectedJob(null)}
          className="flex items-center text-slate-500 hover:text-sky-600 font-medium mb-6 transition-colors"
        >
          <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Careers
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-slate-900 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">Apply for {selectedJob.title}</h2>
            <div className="flex items-center text-slate-300 mt-2 text-sm">
              <Icons.MapPin className="h-4 w-4 mr-2" /> {selectedJob.loc}
              <span className="mx-3">•</span>
              <Icons.Clock className="h-4 w-4 mr-2" /> {selectedJob.type}
              <span className="mx-3">•</span>
              <span className="text-green-400 font-bold">{selectedJob.pay}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input required type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input required type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Experience / Relevant Skills</label>
              <textarea required rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 transition-all" placeholder="Tell us about your driving experience, licenses, or dispatching background..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Resume / CV</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Icons.Upload className="h-6 w-6" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX (Max 5MB)</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setSelectedJob(null)}
                className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={applicationStatus === 'submitting'}
                className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 shadow-lg shadow-sky-200 transition-all flex items-center disabled:opacity-70"
              >
                {applicationStatus === 'submitting' ? 'Sending...' : 'Submit Application'}
                {!applicationStatus !== 'submitting' && <Icons.ChevronRight className="h-5 w-5 ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Join the SAR Network Team</h2>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          We are always looking for dedicated professionals to help us keep drivers safe and moving.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                  <Icons.Briefcase className="h-6 w-6" />
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase">Hiring</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p className="flex items-center"><Icons.MapPin className="h-4 w-4 mr-2" /> {job.loc}</p>
                <p className="flex items-center"><Icons.Clock className="h-4 w-4 mr-2" /> {job.type}</p>
                <p className="flex items-center text-slate-900 font-semibold"><span className="text-green-600 mr-2">$</span> {job.pay}</p>
              </div>
              <button 
                onClick={() => { setSelectedJob(job); window.scrollTo(0, 0); }}
                className="w-full py-2 border-2 border-sky-600 text-sky-600 font-bold rounded-lg hover:bg-sky-50 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
        
        {/* General Application Card */}
        <div className="bg-slate-900 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center text-white">
          <h3 className="text-xl font-bold mb-2">Don't see your role?</h3>
          <p className="text-gray-300 mb-6 text-sm">Send us your resume and we'll keep you on file for future openings.</p>
          <button 
             onClick={() => { setSelectedJob({ title: "General Application", loc: "Various Locations", type: "Full/Part-time", pay: "Competitive" }); window.scrollTo(0, 0); }}
             className="flex items-center text-sky-400 font-bold hover:text-sky-300"
          >
            Submit General Application <Icons.ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => (
  <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Info Side */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Contact Us</h2>
        <p className="text-lg text-gray-600 mb-8">
          Have questions about a bill, a membership, or just want to leave feedback? Reach out to us.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="shrink-0">
              <Icons.Phone className="h-6 w-6 text-sky-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-slate-900">Phone</h3>
              <p className="mt-1 text-gray-500">Emergency: 1-800-SAR-HELP</p>
              <p className="text-gray-500">Office: 973-888-3028</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="shrink-0">
              <Icons.MapPin className="h-6 w-6 text-sky-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-slate-900">Headquarters</h3>
              <p className="mt-1 text-gray-500">
                78 John Miller Way<br />
                Kearny, NJ 07032
              </p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 border border-slate-300">
          <span className="flex items-center font-medium"><Icons.MapPin className="mr-2"/> Map Unavailable in Preview</span>
        </div>
      </div>

      {/* Form Side */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"></textarea>
          </div>
          <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
);

const Footer = ({ setActivePage }) => (
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
          <li><button onClick={() => setActivePage('services')} className="text-gray-400 hover:text-white">Request Service</button></li>
          <li><button onClick={() => setActivePage('about')} className="text-gray-400 hover:text-white">About Us</button></li>
          <li><button onClick={() => setActivePage('careers')} className="text-gray-400 hover:text-white">Careers</button></li>
          <li><button onClick={() => setActivePage('employee')} className="text-gray-400 hover:text-white">Employee Login</button></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Legal</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-800 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} SAR Network. All rights reserved.
    </div>
  </footer>
);

// --- Main App Component ---

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navigation 
        activePage={activePage} 
        setActivePage={setActivePage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-grow">
        {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'services' && <ServiceRequestPage />}
        {activePage === 'careers' && <CareersPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'employee' && <EmployeePortal />}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default App;
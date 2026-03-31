import React, { useState, useEffect } from 'react';

// --- FIREBASE IMPORTS & SETUP ---
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgziMzaC5NUX2_Yru_pEwI-UjG3b4BdHM",
  authDomain: "sar-network.firebaseapp.com",
  projectId: "sar-network",
  storageBucket: "sar-network.firebasestorage.app",
  messagingSenderId: "978015332251",
  appId: "1:978015332251:web:45daf350fdf061c59a233e",
  measurementId: "G-0T4CE4FPEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- SECONDARY FIREBASE APP (For Admin User Creation) ---
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

// --- 🔴 WEB3FORMS KEY 🔴 ---
const WEB3FORMS_KEY = "2f182922-a7f9-483f-afd0-73d11139bbe3"; 


// --- BUILT-IN ICONS ---
const IconWrapper = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
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
  Upload: (p) => <IconWrapper {...p}><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></IconWrapper>,
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
    <circle cx="50" cy="50" r="40" stroke="#2C3E50" strokeWidth="6" />
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M50 10 V90" stroke="#2C3E50" strokeWidth="4" />
    <path d="M20 30 Q50 30 80 30" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M20 70 Q50 70 80 70" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M15 75 Q 40 95 90 45 Q 60 90 15 75 Z" fill="#0EA5E9" />
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
          <div className="flex items-center cursor-pointer group" onClick={() => setActivePage('home')}>
            <div className="bg-white p-1 rounded-full mr-3 group-hover:scale-105 transition-transform">
              <SarLogo className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none">SAR</span>
              <span className="text-sky-400 font-bold tracking-widest text-sm leading-none">NETWORK</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setActivePage(item.id)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activePage === item.id ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none">
              {isMobileMenuOpen ? <Icons.X className="h-6 w-6" /> : <Icons.Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setActivePage(item.id); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${activePage === item.id ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
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
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center min-h-[600px]">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">Stranded? <br /><span className="text-sky-500">We've Got You.</span></h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl mb-8">SAR Network provides 24/7 rapid response towing and roadside assistance. Trusted by thousands of drivers nationwide.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button onClick={() => setActivePage('services')} className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-sky-600 hover:bg-sky-700 md:py-4 md:text-xl shadow-lg shadow-sky-900/50 transition-all hover:-translate-y-1">
            <Icons.AlertTriangle className="mr-2 h-6 w-6" /> Request Help Now
          </button>
          <button onClick={() => setActivePage('contact')} className="flex items-center justify-center px-8 py-4 border-2 border-slate-600 text-lg font-bold rounded-full text-gray-200 hover:bg-slate-800 hover:border-slate-500 md:py-4 md:text-xl transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Why Choose SAR Network?</h2>
          <p className="mt-4 text-xl text-gray-500">Professional service, transparent pricing, and rapid arrival times.</p>
        </div>
        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {[
            { icon: Icons.Clock, title: "24/7 Availability", text: "Day or night, rain or shine, our dispatch team is ready to take your call." },
            { icon: Icons.MapPin, title: "Nationwide Coverage", text: "Our extensive network ensures we can reach you wherever you break down." },
            { icon: Icons.CheckCircle, title: "Certified Professionals", text: "All our operators are licensed, insured, and rigorously trained." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-12 w-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6"><feature.icon className="h-6 w-6" /></div>
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
    <div className="bg-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Our Story & Mission</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">Built on a foundation of trust, speed, and safety, SAR Network has evolved from a single truck operation into the nation's most reliable roadside recovery partner.</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
            <div className="flex items-center mb-4"><Icons.History className="text-sky-600 h-8 w-8 mr-3"/><h2 className="text-3xl font-bold text-slate-900">Our History</h2></div>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">Founded in 2005, <strong>SAR Network</strong> began with a simple mission: to provide honest, reliable help to stranded motorists who felt vulnerable on the side of the road.</p>
            <p className="mb-4">Over the last two decades, we have invested heavily in technology to reduce wait times. In 2015, we launched our proprietary dispatch system.</p>
            <p>Today, SAR Network partners with major insurance providers and manages a fleet of over 500 certified independent operators across the country.</p>
          </div>
        </div>
        <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner">
          <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-300 pb-2">Milestones</h3>
          <ul className="space-y-6">
            <li className="flex"><span className="font-bold text-sky-600 w-24 shrink-0">2005</span><span className="text-gray-700">Company founded in Maplewood, NJ.</span></li>
            <li className="flex"><span className="font-bold text-sky-600 w-24 shrink-0">2010</span><span className="text-gray-700">Expanded to Tri-State area coverage.</span></li>
            <li className="flex"><span className="font-bold text-sky-600 w-24 shrink-0">2015</span><span className="text-gray-700">Launched Digital Dispatch System 1.0.</span></li>
            <li className="flex"><span className="font-bold text-sky-600 w-24 shrink-0">2023</span><span className="text-gray-700">Rebranded to SAR Network; achieved 98% satisfaction rating.</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ServiceRequestPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ type: '', location: '', phone: '', vehicle: '' });

  const services = [
    { id: 'tow', label: 'Towing', icon: Icons.Truck },
    { id: 'flat', label: 'Flat Tire', icon: Icons.AlertTriangle },
    { id: 'lockout', label: 'Lockout', icon: Icons.Key },
    { id: 'battery', label: 'Dead Battery', icon: Icons.Battery },
    { id: 'fuel', label: 'Out of Gas', icon: Icons.Fuel },
  ];

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setIsSubmitting(true);

    const data = new FormData();
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "🚨 NEW TOWING REQUEST");
    data.append("Service Type", formData.type);
    data.append("Location", formData.location);
    data.append("Vehicle Details", formData.vehicle);
    data.append("Phone Number", formData.phone);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const result = await response.json();
      if (result.success) setSubmitted(true);
      else alert("Error: " + result.message);
    } catch (error) {
      alert("Something went wrong. Please call us directly!");
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-green-50 rounded-2xl text-center border border-green-200">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.CheckCircle className="h-8 w-8" /></div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Help is on the way!</h2>
        <p className="text-green-700 mb-6">Your request has been received. A dispatcher will review your info and call you at {formData.phone}.</p>
        <button onClick={() => { setSubmitted(false); setStep(1); }} className="mt-6 text-green-700 font-semibold hover:underline">Start New Request</button>
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
        <div className="p-8">
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {services.map((s) => (
                <button key={s.id} onClick={() => { setFormData({...formData, type: s.label}); setStep(2); }} className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all group">
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
                <input type="text" placeholder="123 Highway Rd, Exit 4..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <button onClick={() => setStep(3)} disabled={!formData.location} className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 disabled:opacity-50">Next Step</button>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Details</label>
                <input required type="text" placeholder="2018 Toyota Camry (Silver)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input required type="tel" placeholder="(555) 123-4567" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 disabled:opacity-50">
                {isSubmitting ? "Sending Request..." : "Confirm Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('idle');

  const jobs = [
    { title: "Tow Truck Operator", type: "Full-time", loc: "Newark Area", pay: "$25-35/hr" },
    { title: "Dispatch Coordinator", type: "Full-time", loc: "Remote/Hybrid", pay: "$20-28/hr" },
    { title: "Roadside Technician", type: "Part-time", loc: "Jersey City", pay: "$22-30/hr" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplicationStatus('submitting');
    
    const data = new FormData(e.target);
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `New Job Application: ${selectedJob.title}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const result = await response.json();
      
      if (result.success) {
        setApplicationStatus('success');
        window.scrollTo(0, 0);
      } else {
        alert("Application failed to send: " + result.message);
        setApplicationStatus('idle');
      }
    } catch (error) {
      alert("Failed to submit. Please try again.");
      setApplicationStatus('idle');
    }
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
          <button onClick={() => { setSelectedJob(null); setApplicationStatus('idle'); }} className="text-green-700 font-bold hover:underline">
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  if (selectedJob) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <button onClick={() => setSelectedJob(null)} className="flex items-center text-slate-500 hover:text-sky-600 font-medium mb-6 transition-colors">
          <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Careers
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-slate-900 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">Apply for {selectedJob.title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                <input required type="text" name="First Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                <input required type="text" name="Last Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input required type="email" name="Email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input required type="tel" name="Phone" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Experience / Relevant Skills</label>
              <textarea required rows={4} name="Experience" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Tell us about your driving experience, licenses, or dispatching background..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Resume / Portfolio Link</label>
              <input 
                required 
                type="url" 
                name="Resume Link" 
                placeholder="Paste a link to your Google Drive, Dropbox, or LinkedIn profile..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 transition-all" 
              />
              <p className="text-xs text-gray-500 mt-2 font-medium">Note: Ensure your document link is set to "Anyone can view".</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
              <button type="button" onClick={() => setSelectedJob(null)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={applicationStatus === 'submitting'} className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:opacity-70">
                {applicationStatus === 'submitting' ? 'Sending...' : 'Submit Application'}
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
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">We are always looking for dedicated professionals to help us keep drivers safe and moving.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
              <button onClick={() => { setSelectedJob(job); window.scrollTo(0, 0); }} className="mt-4 w-full py-2 border-2 border-sky-600 text-sky-600 font-bold rounded-lg hover:bg-sky-50 transition-colors">Apply Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const data = new FormData(e.target);
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "New General Contact Message");

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const result = await response.json();
      
      if (result.success) {
        setStatus("success");
        e.target.reset();
      } else {
        alert("Message failed to send: " + result.message);
        setStatus("idle");
      }
    } catch (error) {
      alert("Failed to send message. Please try calling us instead.");
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-8">Have questions about a bill, a membership, or just want to leave feedback? Reach out to us.</p>
          <div className="space-y-6">
            <div className="flex items-start">
              <Icons.Phone className="h-6 w-6 text-sky-600 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-slate-900">Phone</h3>
                <p className="mt-1 text-gray-500">Emergency: 1-800-SAR-HELP<br/>Office: 973-888-3028</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
          
          {status === "success" ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 text-center font-bold">
              Message sent successfully! We will be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required name="First Name" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required name="Last Name" type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required name="Email" type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea required name="Message" rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"></textarea>
              </div>
              <button disabled={status === "submitting"} type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50">
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// --- UPDATED EMPLOYEE PORTAL (FIREBASE CONNECTED) ---
const EmployeePortal = () => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // User Data State
  const [userData, setUserData] = useState(null);

  // --- ADMIN SPECIFIC STATE ---
  const [adminActiveTab, setAdminActiveTab] = useState('dashboard');
  const [employeeList, setEmployeeList] = useState([]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createMessage, setCreateMessage] = useState(null);
  
  // Admin Schedule Manager States
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [empSchedule, setEmpSchedule] = useState([]);
  const [shiftDate, setShiftDate] = useState('');
  const [shiftTime, setShiftTime] = useState('');
  const [shiftUnit, setShiftUnit] = useState('');

  // --- REGULAR EMPLOYEE SPECIFIC STATE ---
  const [empTab, setEmpTab] = useState('dashboard');
  // Profile Form States
  const [profileAddress, setProfileAddress] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileRouting, setProfileRouting] = useState('');
  const [profileAccount, setProfileAccount] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  // Employee Schedule State
  const [mySchedule, setMySchedule] = useState([]);
  // Time Off Form States
  const [timeOffStart, setTimeOffStart] = useState('');
  const [timeOffEnd, setTimeOffEnd] = useState('');
  const [timeOffReason, setTimeOffReason] = useState('');
  const [timeOffStatus, setTimeOffStatus] = useState('');
  const [timeOffHistory, setTimeOffHistory] = useState([]);

  // Fetch extra data for Admin/Employees
  useEffect(() => {
    if (userData?.role === 'admin' && (adminActiveTab === 'directory' || adminActiveTab === 'scheduleManager')) {
      fetchEmployees();
    }
    if (userData?.role !== 'admin' && user && empTab === 'timeoff') {
      fetchTimeOffHistory();
    }
    if (userData?.role !== 'admin' && user && empTab === 'schedule') {
      fetchMySchedule();
    }
  }, [adminActiveTab, userData, empTab]);

  // Fetch specific employee schedule when Admin selects them
  useEffect(() => {
    if (adminActiveTab === 'scheduleManager' && selectedEmpId) {
      fetchEmpSchedule(selectedEmpId);
    }
  }, [selectedEmpId, adminActiveTab]);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setEmployeeList(users);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchEmpSchedule = async (uid) => {
    if (!uid) return setEmpSchedule([]);
    try {
      const snap = await getDocs(collection(db, "users", uid, "schedules"));
      const shifts = [];
      snap.forEach(doc => shifts.push({ id: doc.id, ...doc.data() }));
      shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEmpSchedule(shifts);
    } catch (error) {
      console.error("Error fetching admin schedule:", error);
    }
  };

  const fetchMySchedule = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, "users", user.uid, "schedules"));
      const shifts = [];
      snap.forEach(doc => shifts.push({ id: doc.id, ...doc.data() }));
      shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
      setMySchedule(shifts);
    } catch (error) {
      console.error("Error fetching my schedule:", error);
    }
  };

  const fetchTimeOffHistory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "time_off"));
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      setTimeOffHistory(requests);
    } catch (error) {
      console.error("Error fetching time off:", error);
    }
  };

  // --- ADMIN FUNCTIONS ---
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setIsCreatingUser(true);
    setCreateMessage(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newEmpEmail, newEmpPassword);
      const newUserId = userCredential.user.uid;
      
      await setDoc(doc(db, "users", newUserId), {
        name: newEmpName,
        email: newEmpEmail,
        role: 'employee',
        status: 'Active',
        workStatus: 'Clocked Out',
        createdAt: new Date().toISOString()
      });
      
      await signOut(secondaryAuth);
      
      setCreateMessage({ type: 'success', text: `Successfully created account for ${newEmpName}!` });
      setNewEmpName('');
      setNewEmpEmail('');
      setNewEmpPassword('');
      fetchEmployees();
    } catch (error) {
      setCreateMessage({ type: 'error', text: error.message });
    }
    setIsCreatingUser(false);
  };

  const handleAddShift = async (e) => {
    e.preventDefault();
    if(!selectedEmpId) return;
    try {
      await addDoc(collection(db, "users", selectedEmpId, "schedules"), {
        date: shiftDate,
        time: shiftTime,
        unit: shiftUnit,
        status: 'Scheduled'
      });
      setShiftDate(''); setShiftTime(''); setShiftUnit('');
      fetchEmpSchedule(selectedEmpId); // Refresh table
    } catch (error) {
      alert("Failed to assign shift.");
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if(!confirm("Remove this shift?")) return;
    try {
      await deleteDoc(doc(db, "users", selectedEmpId, "schedules", shiftId));
      fetchEmpSchedule(selectedEmpId);
    } catch (error) {
      alert("Failed to remove shift.");
    }
  };

  // --- EMPLOYEE FUNCTIONS ---
  const handleClockToggle = async () => {
    if (!user) return;
    const isCurrentlyClockedIn = userData?.workStatus === 'Clocked In';
    const newStatus = isCurrentlyClockedIn ? 'Clocked Out' : 'Clocked In';
    const timestamp = new Date().toLocaleString();

    try {
      await updateDoc(doc(db, "users", user.uid), { 
        workStatus: newStatus,
        lastPunch: timestamp
      });
      setUserData({ ...userData, workStatus: newStatus, lastPunch: timestamp });
    } catch (error) {
      alert("Failed to clock in. Check connection.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileStatus('saving');
    try {
      await updateDoc(doc(db, "users", user.uid), {
        address: profileAddress,
        phone: profilePhone,
        banking: { routing: profileRouting, account: profileAccount }
      });
      setUserData({ ...userData, address: profileAddress, phone: profilePhone, banking: { routing: profileRouting, account: profileAccount } });
      setProfileStatus('saved');
      setTimeout(() => setProfileStatus(''), 3000);
    } catch (error) {
      setProfileStatus('error');
    }
  };

  const handleTimeOffSubmit = async (e) => {
    e.preventDefault();
    setTimeOffStatus('submitting');
    try {
      await addDoc(collection(db, "users", user.uid, "time_off"), {
        startDate: timeOffStart,
        endDate: timeOffEnd,
        reason: timeOffReason,
        status: 'Pending Approval',
        submittedAt: new Date().toISOString()
      });
      setTimeOffStatus('success');
      setTimeOffStart(''); setTimeOffEnd(''); setTimeOffReason('');
      fetchTimeOffHistory();
      setTimeout(() => setTimeOffStatus(''), 3000);
    } catch (error) {
      setTimeOffStatus('error');
    }
  };

  // Listen for Firebase Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          // Pre-fill profile forms if data exists
          if (data.address) setProfileAddress(data.address);
          if (data.phone) setProfilePhone(data.phone);
          if (data.banking) {
            setProfileRouting(data.banking.routing || '');
            setProfileAccount(data.banking.account || '');
          }
        } else {
          setUserData({ role: 'employee', name: currentUser.email, workStatus: 'Clocked Out' });
        }
      } else {
        setUserData(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError("Invalid email or password.");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loadingAuth) {
    return <div className="flex justify-center py-20"><p className="text-gray-500 font-bold animate-pulse">Connecting to Server...</p></div>;
  }

  // --- SHOW LOGIN SCREEN IF NOT LOGGED IN ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6"><SarLogo className="h-16 w-16" /></div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Employee Secure Login</h2>
          
          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-semibold border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" 
                placeholder="you@sarnetwork.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              disabled={isLoggingIn}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? "Authenticating..." : "Access Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  if (userData?.role === 'admin') {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8 bg-sky-900 text-white p-6 rounded-xl shadow-lg">
          <div>
            <h2 className="text-2xl font-black flex items-center"><Icons.Shield className="h-6 w-6 mr-2" /> Admin Dashboard</h2>
            <p className="text-sky-200 text-sm">Welcome back, Boss. Logged in as: {user.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-sky-800 hover:bg-red-600 rounded-lg transition-colors font-bold text-sm">
            <Icons.LogOut className="h-4 w-4 mr-2" /> Sign Out
          </button>
        </div>

        {adminActiveTab === 'dashboard' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">Pending Time Off</h3>
              <p className="text-3xl font-black text-orange-500">1</p>
              <button className="mt-4 text-sm text-sky-600 font-bold">Review Requests &rarr;</button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">Active Drivers</h3>
              <p className="text-3xl font-black text-green-500">12 / 15</p>
              <button className="mt-4 text-sm text-sky-600 font-bold">View Fleet &rarr;</button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">Fleet Schedules</h3>
              <p className="text-gray-500 text-sm mb-4">Assign shifts and trucks to drivers.</p>
              <button onClick={() => setAdminActiveTab('scheduleManager')} className="bg-sky-600 text-white py-2 px-4 rounded font-bold text-sm w-full hover:bg-sky-700 transition-colors">Manage Schedules</button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">Manage Employees</h3>
              <p className="text-gray-500 text-sm mb-4">Create or disable employee accounts.</p>
              <button onClick={() => setAdminActiveTab('directory')} className="bg-slate-900 text-white py-2 px-4 rounded font-bold text-sm w-full hover:bg-slate-800 transition-colors">Open Directory</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button onClick={() => setAdminActiveTab('dashboard')} className="flex items-center text-slate-500 hover:text-sky-600 font-bold mb-4 transition-colors">
              <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>
            
            {/* DIRECTORY VIEW */}
            {adminActiveTab === 'directory' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
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

                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Active Team Members</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 text-sm">
                        <tr>
                          <th className="p-4 font-semibold">Name</th>
                          <th className="p-4 font-semibold">Email</th>
                          <th className="p-4 font-semibold">Role</th>
                          <th className="p-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {employeeList.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-900">{emp.name || 'Admin User'}</td>
                            <td className="p-4 text-slate-600">{emp.email}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                                {emp.role || 'employee'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">
                                {emp.status || 'Active'}
                              </span>
                            </td>
                          </tr>
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
            )}

            {/* SCHEDULE MANAGER VIEW */}
            {adminActiveTab === 'scheduleManager' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><Icons.Calendar className="h-5 w-5 mr-2 text-sky-600" /> Dispatch Schedule Manager</h3>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Driver to Manage</label>
                  <select
                    className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-slate-50 font-bold"
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                  >
                    <option value="">-- Choose an Employee --</option>
                    {employeeList.filter(emp => emp.role !== 'admin').map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                    ))}
                  </select>
                </div>

                {selectedEmpId && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Shift Form */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Assign New Shift</h3>
                      <form onSubmit={handleAddShift} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                          <input type="date" required value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Shift Time</label>
                          <input type="text" required placeholder="e.g., 8:00 AM - 4:00 PM" value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Unit</label>
                          <input type="text" required placeholder="e.g., Tow-402" value={shiftUnit} onChange={(e) => setShiftUnit(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg">
                          Save Shift
                        </button>
                      </form>
                    </div>

                    {/* Employee's Shift List */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100 bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-900">Driver's Calendar</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-600 text-sm">
                            <tr>
                              <th className="p-4 font-semibold">Date</th>
                              <th className="p-4 font-semibold">Time</th>
                              <th className="p-4 font-semibold">Unit</th>
                              <th className="p-4 font-semibold text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {empSchedule.map((shift) => (
                              <tr key={shift.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">{shift.date}</td>
                                <td className="p-4 text-slate-600">{shift.time}</td>
                                <td className="p-4 font-mono text-slate-500">{shift.unit}</td>
                                <td className="p-4 text-center">
                                  <button onClick={() => handleDeleteShift(shift.id)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded-md">
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {empSchedule.length === 0 && (
                              <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No shifts assigned to this driver yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- REGULAR EMPLOYEE VIEW ---
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Employee Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl mr-4">
            <Icons.User />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome, {userData?.name || 'Driver'}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
          <Icons.LogOut className="h-5 w-5 mr-2" /> Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
          <nav className="space-y-2">
            <button onClick={() => setEmpTab('dashboard')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'dashboard' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.Clock className="h-5 w-5 mr-3"/> Time Clock
            </button>
            <button onClick={() => setEmpTab('schedule')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'schedule' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.Calendar className="h-5 w-5 mr-3"/> My Schedule
            </button>
            <button onClick={() => setEmpTab('timeoff')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'timeoff' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.Palmtree className="h-5 w-5 mr-3"/> Request Time Off
            </button>
            <button onClick={() => setEmpTab('profile')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'profile' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.User className="h-5 w-5 mr-3"/> My Profile
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          
          {/* TAB 1: TIME CLOCK & STATS */}
          {empTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Shift Status</h3>
                <p className="text-gray-500 mb-8">Record your hours securely to the database.</p>
                
                <div className={`p-6 rounded-2xl border-2 mb-8 ${userData?.workStatus === 'Clocked In' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                  <p className={`text-3xl font-black ${userData?.workStatus === 'Clocked In' ? 'text-green-600' : 'text-slate-700'}`}>
                    {userData?.workStatus || 'Clocked Out'}
                  </p>
                  {userData?.lastPunch && (
                    <p className="text-sm text-gray-500 mt-2">Last punch: {userData.lastPunch}</p>
                  )}
                </div>

                <button 
                  onClick={handleClockToggle}
                  className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-transform hover:-translate-y-1 ${userData?.workStatus === 'Clocked In' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'}`}
                >
                  {userData?.workStatus === 'Clocked In' ? 'CLOCK OUT' : 'CLOCK IN'}
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 h-full">
                  <h4 className="font-bold text-slate-700 mb-6 text-lg">Current Pay Period Stats</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center"><Icons.Clock className="h-6 w-6 text-sky-500 mr-3"/> <span className="font-bold text-slate-700">Hours Worked</span></div>
                      <span className="text-2xl font-black text-slate-900">{userData?.hoursWorked || '0.0'} <span className="text-sm font-medium text-gray-500">hrs</span></span>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center"><Icons.Palmtree className="h-6 w-6 text-green-500 mr-3"/> <span className="font-bold text-slate-700">PTO Earned</span></div>
                      <span className="text-2xl font-black text-slate-900">{userData?.ptoEarned || '0.0'} <span className="text-sm font-medium text-gray-500">hrs</span></span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-6 text-center">Stats automatically sync with Admin dispatch timesheets.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.5: SCHEDULE CALENDAR */}
          {empTab === 'schedule' && (
            <div>
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-slate-900">My Schedule</h3>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-sm">
                        <th className="p-4 font-bold border-b border-gray-100">Date</th>
                        <th className="p-4 font-bold border-b border-gray-100">Shift Time</th>
                        <th className="p-4 font-bold border-b border-gray-100">Assigned Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mySchedule.map((shift, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-semibold text-slate-800">{shift.date}</td>
                          <td className="p-4 text-slate-600">{shift.time}</td>
                          <td className="p-4 text-slate-500 font-mono font-bold">{shift.unit}</td>
                        </tr>
                      ))}
                      {mySchedule.length === 0 && (
                        <tr>
                          <td colSpan="3" className="p-8 text-center text-gray-500 font-medium">No upcoming shifts have been scheduled for you yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIME OFF */}
          {empTab === 'timeoff' && (
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Request Time Off</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-orange-100 text-orange-600 rounded-xl mr-4">
                    <Icons.Thermometer className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sick Hours Available</p>
                    <p className="text-2xl font-black text-slate-900">{userData?.sickEarned || '24.0'} hrs</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-teal-100 text-teal-600 rounded-xl mr-4">
                    <Icons.Palmtree className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Vacation (PTO) Available</p>
                    <p className="text-2xl font-black text-slate-900">{userData?.ptoEarned || '0.0'} hrs</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <form onSubmit={handleTimeOffSubmit} className="space-y-4">
                  {timeOffStatus === 'success' && <div className="bg-green-50 text-green-700 p-3 rounded-lg font-bold border border-green-200">Request submitted to Admin!</div>}
                  {timeOffStatus === 'error' && <div className="bg-red-50 text-red-600 p-3 rounded-lg font-bold border border-red-200">Failed to submit.</div>}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                      <input type="date" required value={timeOffStart} onChange={(e) => setTimeOffStart(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                      <input type="date" required value={timeOffEnd} onChange={(e) => setTimeOffEnd(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Reason (Optional)</label>
                    <input type="text" value={timeOffReason} onChange={(e) => setTimeOffReason(e.target.value)} placeholder="Vacation, Doctor Appt, etc." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <button type="submit" disabled={timeOffStatus === 'submitting'} className="bg-sky-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-700 w-full disabled:opacity-50">
                    {timeOffStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>

                <div>
                  <h4 className="font-bold text-slate-700 mb-4">Your Recent Requests</h4>
                  <div className="space-y-3">
                    {timeOffHistory.map((req) => (
                      <div key={req.id} className="p-3 border border-gray-100 bg-slate-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-slate-800">{req.startDate} to {req.endDate}</p>
                          <p className="text-xs text-gray-500">{req.reason || 'No reason provided'}</p>
                        </div>
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold uppercase">{req.status}</span>
                      </div>
                    ))}
                    {timeOffHistory.length === 0 && <p className="text-sm text-gray-500">No time off requested yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & BANKING */}
          {empTab === 'profile' && (
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
          )}

        </div>
      </div>
    </div>
  );
};


const Footer = ({ setActivePage }) => (
  <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 px-4 text-center">
    <p>&copy; {new Date().getFullYear()} SAR Network. All rights reserved.</p>
  </footer>
);

// --- Main App Component ---
const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [activePage]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navigation activePage={activePage} setActivePage={setActivePage} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
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

import React, { useState, useEffect } from 'react';

// --- FIREBASE IMPORTS & SETUP ---
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
  ChevronLeft: (p) => <IconWrapper {...p}><polyline points="15 18 9 12 15 6"></polyline></IconWrapper>,
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
  Save: (p) => <IconWrapper {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></IconWrapper>,
  Mail: (p) => <IconWrapper {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></IconWrapper>,
  Eye: (p) => <IconWrapper {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></IconWrapper>,
  Bell: (p) => <IconWrapper {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></IconWrapper>
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
  const [isLocating, setIsLocating] = useState(false);
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, location: `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
        setIsLocating(false);
      },
      (error) => {
        alert(`Location access failed: ${error.message}. Please type your location manually or ensure your browser has location permissions enabled.`);
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      } 
    );
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
                <button 
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="mt-2 text-sky-600 text-sm font-bold flex items-center hover:text-sky-700 disabled:opacity-50 transition-opacity"
                >
                  <Icons.MapPin className="h-4 w-4 mr-1" /> 
                  {isLocating ? "Finding your exact location..." : "Share my exact GPS location"}
                </button>
              </div>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.location}
                className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
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
  const [applicationStatus, setApplicationStatus] = useState('idle'); // idle, submitting, success
  const [liveJobs, setLiveJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    const getLiveJobs = async () => {
      try {
        const snap = await getDocs(collection(db, "jobs"));
        const fetched = [];
        snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
        setLiveJobs(fetched);
      } catch (err) {
        console.error("Error fetching live jobs:", err);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    getLiveJobs();
  }, []);

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
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          We are always looking for dedicated professionals to help us keep drivers safe and moving.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingJobs ? (
          <div className="col-span-full py-12 text-center text-gray-500 font-bold animate-pulse">
            Loading live job openings...
          </div>
        ) : (
          liveJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                    <Icons.Briefcase className="h-6 w-6" />
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold uppercase">Hiring</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                
                {/* NEW: Job Description rendering */}
                {job.desc && <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{job.desc}</p>}
                
                <div className="space-y-2 text-sm text-gray-600 mb-6 mt-auto pt-4 border-t border-gray-100">
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
          ))
        )}
        
        {/* FIXED: General Application Card Restored */}
        <div className="bg-slate-900 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center text-white transition-all hover:-translate-y-1">
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
              
              {/* NEW: Optional Phone Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required name="Email" type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input name="Phone" type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                </div>
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
  const [expandedEmpId, setExpandedEmpId] = useState(null); // State for expanding HR Directory
  
  // Admin Schedule Manager States
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [empSchedule, setEmpSchedule] = useState([]);
  const [shiftDate, setShiftDate] = useState('');
  const [shiftTime, setShiftTime] = useState('');
  const [shiftUnit, setShiftUnit] = useState('');

  // Admin Time Off Manager States
  const [allTimeOffRequests, setAllTimeOffRequests] = useState([]);

  // Admin Job Manager States
  const [adminJobs, setAdminJobs] = useState([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobType, setNewJobType] = useState('Full-time');
  const [newJobLoc, setNewJobLoc] = useState('');
  const [newJobPay, setNewJobPay] = useState('');
  const [newJobDesc, setNewJobDesc] = useState(''); // NEW: Job description state

  // --- REGULAR EMPLOYEE SPECIFIC STATE ---
  const [empTab, setEmpTab] = useState('dashboard');
  // Profile Form States
  const [profileAddress, setProfileAddress] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileRouting, setProfileRouting] = useState('');
  const [profileAccount, setProfileAccount] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  
  // Employee Schedule State & Calendar Modals
  const [mySchedule, setMySchedule] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedShiftModal, setSelectedShiftModal] = useState(null); // NEW: For clicking a day
  
  // Time Off Form States
  const [timeOffStart, setTimeOffStart] = useState('');
  const [timeOffEnd, setTimeOffEnd] = useState('');
  const [timeOffReason, setTimeOffReason] = useState('Vacation');
  const [timeOffPayType, setTimeOffPayType] = useState('Use Earned PTO');
  const [timeOffStatus, setTimeOffStatus] = useState('');
  const [timeOffHistory, setTimeOffHistory] = useState([]);
  
  // Employee Notifications
  const [notifications, setNotifications] = useState([]);

  // Fetch extra data for Admin/Employees
  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchEmployees();
      fetchAllTimeOffRequests();
      fetchAdminJobs();
    }
    if (userData?.role !== 'admin' && user && empTab === 'timeoff') {
      fetchTimeOffHistory();
    }
    if (userData?.role !== 'admin' && user && empTab === 'schedule') {
      fetchMySchedule();
    }
    if (userData?.role !== 'admin' && user && empTab === 'dashboard') {
      fetchMyNotifications();
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

  const fetchAllTimeOffRequests = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let requests = [];
      for (const userDoc of usersSnap.docs) {
        const uData = userDoc.data();
        const timeOffSnap = await getDocs(collection(db, "users", userDoc.id, "time_off"));
        timeOffSnap.forEach(reqDoc => {
          requests.push({
            id: reqDoc.id,
            userId: userDoc.id,
            userName: uData.name || 'Unknown Driver',
            ...reqDoc.data()
          });
        });
      }
      // Sort so newest requests appear at the top
      requests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      setAllTimeOffRequests(requests);
    } catch (error) {
      console.error("Error fetching all time off:", error);
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

  const fetchAdminJobs = async () => {
    try {
      const snap = await getDocs(collection(db, "jobs"));
      const j = [];
      snap.forEach(doc => j.push({ id: doc.id, ...doc.data() }));
      j.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setAdminJobs(j);
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
    }
  };
  
  const fetchMyNotifications = async () => {
    if(!user) return;
    try {
      const snap = await getDocs(collection(db, "users", user.uid, "notifications"));
      const notifs = [];
      snap.forEach(doc => notifs.push({ id: doc.id, ...doc.data() }));
      notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications", error);
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

  const handleToggleEmployeeStatus = async (empId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await updateDoc(doc(db, "users", empId), { status: newStatus });
      fetchEmployees();
    } catch (error) {
      alert("Failed to update employee status.");
    }
  };

  const handleDeleteEmployee = async (empId, empName) => {
    const confirmText = prompt(`SECURITY WARNING: You are about to permanently delete the account for ${empName || 'this employee'}.\n\nTo confirm, please type the word DELETE below:`);
    if (confirmText !== "DELETE") {
      alert("Account deletion cancelled.");
      return;
    }
    try {
      await deleteDoc(doc(db, "users", empId));
      fetchEmployees();
      alert(`${empName || 'Employee'} has been successfully deleted.`);
    } catch (error) {
      alert("Failed to delete employee.");
    }
  };

  const handlePasswordReset = async (empEmail) => {
    if(!confirm(`Are you sure you want to send a password reset email to ${empEmail}?`)) return;
    try {
      await sendPasswordResetEmail(auth, empEmail);
      alert("Password reset email sent successfully! The driver can use the link in their email to set a new password.");
    } catch (error) {
      alert("Failed to send password reset email. Ensure the email address is correct.");
    }
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

  const handleTimeOffAction = async (userId, reqId, newStatus, reqObj) => {
    try {
      await updateDoc(doc(db, "users", userId, "time_off", reqId), { status: newStatus });

      if (newStatus === 'Approved') {
        const start = new Date(reqObj.startDate);
        const end = new Date(reqObj.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const hoursToDeduct = days > 0 ? days * 8 : 8;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const uData = userSnap.data();
          if (reqObj.payType === 'Use PTO' || reqObj.payType === 'Use Earned PTO') {
            const currentPto = parseFloat(uData.ptoEarned || 0);
            await updateDoc(userRef, { ptoEarned: Math.max(0, currentPto - hoursToDeduct).toFixed(2) });
          } else if (reqObj.payType === 'Use Sick Hours' || reqObj.payType === 'Use Earned Sick Hours') {
            const currentSick = parseFloat(uData.sickEarned || 24);
            await updateDoc(userRef, { sickEarned: Math.max(0, currentSick - hoursToDeduct).toFixed(2) });
          }
        }
      }
      
      // NEW: Create an in-app notification for the employee
      await addDoc(collection(db, "users", userId, "notifications"), {
        message: `Your time-off request for ${reqObj.startDate} has been ${newStatus.toUpperCase()}.`,
        createdAt: new Date().toISOString(),
        read: false
      });
      
      alert(`Request has been successfully ${newStatus.toUpperCase()} and the employee has been notified.`);
      fetchAllTimeOffRequests();
    } catch (error) {
      alert("Failed to update request status: " + error.message);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "jobs"), {
        title: newJobTitle,
        desc: newJobDesc, // NEW: Added job description
        type: newJobType,
        loc: newJobLoc,
        pay: newJobPay,
        createdAt: new Date().toISOString()
      });
      setNewJobTitle('');
      setNewJobDesc('');
      setNewJobType('Full-time');
      setNewJobLoc('');
      setNewJobPay('');
      fetchAdminJobs();
      alert("Job posted successfully!");
    } catch (error) {
      alert("Failed to post job.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if(!confirm("Are you sure you want to permanently delete this job posting?")) return;
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      fetchAdminJobs();
    } catch (error) {
      alert("Failed to delete job.");
    }
  };

  // --- EMPLOYEE FUNCTIONS ---
  const handleClockToggle = async () => {
    if (!user) return;
    const isCurrentlyClockedIn = userData?.workStatus === 'Clocked In';
    const newStatus = isCurrentlyClockedIn ? 'Clocked Out' : 'Clocked In';
    const nowISO = new Date().toISOString(); // NEW: Store as ISO for precise math
    
    let updates = { 
      workStatus: newStatus,
      lastPunch: nowISO 
    };

    // NEW: If clocking out, calculate precise hours worked and accrue PTO/Sick
    if (isCurrentlyClockedIn && userData.lastPunch) {
      const startTime = new Date(userData.lastPunch).getTime();
      const endTime = new Date(nowISO).getTime();
      
      if (!isNaN(startTime)) {
        // Calculate exact hours elapsed
        const hoursElapsed = (endTime - startTime) / (1000 * 60 * 60);
        const currentHours = parseFloat(userData.hoursWorked || 0) + hoursElapsed;
        
        // Placeholder Accrual System: Earns 0.02 hours of PTO & Sick per hour worked
        const currentPto = parseFloat(userData.ptoEarned || 0) + (hoursElapsed * 0.02);
        const currentSick = parseFloat(userData.sickEarned || 24) + (hoursElapsed * 0.02); // Defaults to 24 start

        updates.hoursWorked = currentHours.toFixed(2);
        updates.ptoEarned = currentPto.toFixed(2);
        updates.sickEarned = currentSick.toFixed(2);
      }
    }

    try {
      await updateDoc(doc(db, "users", user.uid), updates);
      setUserData({ ...userData, ...updates });
    } catch (error) {
      alert("Failed to clock in/out. Check connection.");
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

      // SILENT ADMIN ALERT: Send email via Web3Forms
      const alertData = new FormData();
      alertData.append("access_key", WEB3FORMS_KEY);
      alertData.append("subject", `🚨 PROFILE UPDATE: ${userData?.name || user.email}`);
      alertData.append("Employee", userData?.name || user.email);
      alertData.append("New Address", profileAddress || "N/A");
      alertData.append("New Phone", profilePhone || "N/A");
      alertData.append("Banking Info", profileRouting || profileAccount ? "Updated (Log in to view securely)" : "No Change");
      
      fetch("https://api.web3forms.com/submit", { method: "POST", body: alertData }).catch(e => console.log("Email alert failed", e));

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
        payType: timeOffPayType,
        status: 'Pending Approval',
        submittedAt: new Date().toISOString()
      });

      // SILENT ADMIN ALERT: Send email via Web3Forms
      const alertData = new FormData();
      alertData.append("access_key", WEB3FORMS_KEY);
      alertData.append("subject", `🚨 TIME OFF REQUEST: ${userData?.name || user.email}`);
      alertData.append("Employee", userData?.name || user.email);
      alertData.append("Dates Requested", `${timeOffStart} to ${timeOffEnd}`);
      alertData.append("Reason", timeOffReason);
      alertData.append("Pay Type", timeOffPayType);
      
      fetch("https://api.web3forms.com/submit", { method: "POST", body: alertData }).catch(e => console.log("Email alert failed", e));

      setTimeOffStatus('success');
      setTimeOffStart(''); setTimeOffEnd(''); setTimeOffReason('Vacation'); setTimeOffPayType('Use Earned PTO');
      fetchTimeOffHistory();
      setTimeout(() => setTimeOffStatus(''), 3000);
    } catch (error) {
      setTimeOffStatus('error');
    }
  };
  
  const handleMarkNotificationRead = async (notifId) => {
    try {
      await updateDoc(doc(db, "users", user.uid, "notifications", notifId), { read: true });
      fetchMyNotifications();
    } catch (e) { console.log(e); }
  }

  // Listen for Firebase Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          // SECURITY CHECK: Kick out inactive users
          if (data.status === 'Inactive') {
            alert("This account has been deactivated by an Administrator.");
            await signOut(auth);
            return;
          }

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

  // --- CALENDAR LOGIC SETUP ---
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(calendarYear, calendarMonth, i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    calendarDays.push({ day: i, dateString: `${yyyy}-${mm}-${dd}` });
  }
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const handlePrevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else { setCalendarMonth(m => m - 1); }
  }
  const handleNextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else { setCalendarMonth(m => m + 1); }
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
          <div className="flex space-x-3">
            <button onClick={() => setAdminActiveTab('profile')} className="flex items-center px-4 py-2 bg-sky-800 hover:bg-sky-700 rounded-lg transition-colors font-bold text-sm">
              <Icons.User className="h-4 w-4 mr-2" /> Profile
            </button>
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-sky-800 hover:bg-red-600 rounded-lg transition-colors font-bold text-sm">
              <Icons.LogOut className="h-4 w-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>

        {adminActiveTab === 'dashboard' ? (
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

            {/* NEW JOB BOARD CARD */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAdminActiveTab('jobManager')}>
              <h3 className="font-bold text-gray-800 mb-2">Job Postings</h3>
              <p className="text-3xl font-black text-blue-500">
                {adminJobs.length}
              </p>
              <button className="mt-4 text-sm text-sky-600 font-bold">Manage Job Board &rarr;</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button onClick={() => setAdminActiveTab('dashboard')} className="flex items-center text-slate-500 hover:text-sky-600 font-bold mb-4 transition-colors">
              <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>
            
            {/* 1. NEW FLEET TRACKER VIEW */}
            {adminActiveTab === 'fleetView' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center"><Icons.Truck className="h-6 w-6 mr-2 text-sky-600" /> Live Fleet Tracker</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse">Monitoring Live System</span>
                </div>

                <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-4">Clocked In (On Duty)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {employeeList.filter(emp => emp.role !== 'admin' && emp.workStatus === 'Clocked In').map(emp => (
                    <div key={emp.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-slate-900">{emp.name}</h4>
                        <span className="flex items-center text-green-600 font-bold text-xs uppercase"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Active</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center mb-1"><Icons.Phone className="h-4 w-4 mr-1 text-slate-400" /> {emp.phone || 'No phone listed'}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Icons.Clock className="h-4 w-4 mr-1 text-slate-400" /> Punched in: {emp.lastPunch ? new Date(emp.lastPunch).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Unknown'}
                      </p>
                    </div>
                  ))}
                  {employeeList.filter(emp => emp.role !== 'admin' && emp.workStatus === 'Clocked In').length === 0 && (
                    <div className="col-span-full p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500 font-medium">
                      No drivers are currently clocked in.
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-4">Clocked Out (Off Duty)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {employeeList.filter(emp => emp.role !== 'admin' && emp.workStatus !== 'Clocked In').map(emp => (
                    <div key={emp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h4 className="font-bold text-slate-700">{emp.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Last punch: {emp.lastPunch ? new Date(emp.lastPunch).toLocaleDateString([], {month:'short', day:'numeric'}) : 'Never'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. ADVANCED HR DIRECTORY VIEW */}
            {adminActiveTab === 'directory' && (
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
                            
                            {/* EXPANDABLE HR DETAILS ROW WITH ADMIN HOURS OVEVIEW */}
                            {expandedEmpId === emp.id && (
                              <tr className="bg-slate-50 border-b-2 border-slate-200 shadow-inner">
                                <td colSpan="4" className="p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                    {/* NEW: Admin views total hours, pto, sick */}
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
            )}

            {/* 3. SCHEDULE MANAGER VIEW */}
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
                          <input type="text" required placeholder="e.g., 8:00 AM - 4:00 PM or OFF" value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
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

            {/* 4. TIME OFF MANAGER VIEW */}
            {adminActiveTab === 'timeoffManager' && (
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
            )}

            {/* 5. JOB BOARD MANAGER VIEW */}
            {adminActiveTab === 'jobManager' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center"><Icons.Briefcase className="h-5 w-5 mr-2 text-sky-600" /> Public Job Board Manager</h3>
                  <p className="text-gray-500 text-sm mb-6">Jobs posted here will instantly appear on the public Careers page.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Job Form */}
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
                        {/* NEW: Job Description Field */}
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Job Description</label>
                          <textarea required rows={3} value={newJobDesc} onChange={(e) => setNewJobDesc(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Briefly describe responsibilities..."></textarea>
                        </div>
                        <button type="submit" className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 transition-colors">
                          Post Job
                        </button>
                      </form>
                    </div>

                    {/* Active Jobs Table */}
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
            )}

            {/* 6. ADMIN PROFILE VIEW */}
            {adminActiveTab === 'profile' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4 flex items-center">
                  <Icons.User className="h-6 w-6 mr-2 text-sky-600"/> Admin Profile & Banking Info
                </h3>
                
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
        )}
      </div>
    );
  }

  // --- REGULAR EMPLOYEE VIEW ---
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* NEW: Shift Details Popup Modal */}
      {selectedShiftModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedShiftModal(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
             <h3 className="text-2xl font-black text-slate-900 mb-6 border-b pb-2">Shift Details</h3>
             <div className="space-y-4 text-slate-700">
               <p><strong className="text-slate-900 block text-xs uppercase tracking-wider mb-1">Date</strong> {selectedShiftModal.date}</p>
               <p><strong className="text-slate-900 block text-xs uppercase tracking-wider mb-1">Time</strong> {selectedShiftModal.time}</p>
               <p><strong className="text-slate-900 block text-xs uppercase tracking-wider mb-1">Assigned Unit</strong> <span className="font-mono bg-slate-100 px-2 py-1 rounded">{selectedShiftModal.unit}</span></p>
             </div>
             <button onClick={() => setSelectedShiftModal(null)} className="mt-8 w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg">Close Details</button>
          </div>
        </div>
      )}

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
            <div>
              {/* NEW: Employee In-App Notifications Alert */}
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="bg-sky-50 border-l-4 border-sky-500 p-5 rounded-r-xl mb-8 shadow-sm">
                  <h4 className="font-bold text-sky-800 flex items-center mb-2"><Icons.AlertTriangle className="h-5 w-5 mr-2"/> New Notifications</h4>
                  <ul className="space-y-3">
                    {notifications.filter(n => !n.read).map(n => (
                       <li key={n.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-lg border border-sky-100 gap-3">
                         <span className="text-sm font-medium text-slate-700">{n.message}</span>
                         <button onClick={() => handleMarkNotificationRead(n.id)} className="text-xs bg-sky-100 text-sky-700 px-3 py-1.5 rounded-md font-bold hover:bg-sky-200 shrink-0">Mark as Read</button>
                       </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Shift Status</h3>
                  <p className="text-gray-500 mb-8">Record your exact hours to the database.</p>
                  
                  <div className={`p-6 rounded-2xl border-2 mb-8 ${userData?.workStatus === 'Clocked In' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                    <p className={`text-3xl font-black ${userData?.workStatus === 'Clocked In' ? 'text-green-600' : 'text-slate-700'}`}>
                      {userData?.workStatus || 'Clocked Out'}
                    </p>
                    {userData?.lastPunch && (
                      <p className="text-sm text-gray-500 mt-2">
                        Last punch: {new Date(userData.lastPunch).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'})}
                      </p>
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
                    <h4 className="font-bold text-slate-700 mb-6 text-lg">Your Hours & Accruals</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center"><Icons.Clock className="h-6 w-6 text-sky-500 mr-3"/> <span className="font-bold text-slate-700">Total Hours</span></div>
                        <span className="text-2xl font-black text-slate-900">{userData?.hoursWorked || '0.00'} <span className="text-sm font-medium text-gray-500">hrs</span></span>
                      </div>
                      <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center"><Icons.Palmtree className="h-6 w-6 text-green-500 mr-3"/> <span className="font-bold text-slate-700">PTO Earned</span></div>
                        <span className="text-2xl font-black text-slate-900">{userData?.ptoEarned || '0.00'} <span className="text-sm font-medium text-gray-500">hrs</span></span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-6 text-center">Your exact clocked hours accurately accumulate here.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.5: SCHEDULE CALENDAR */}
          {empTab === 'schedule' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
                <h3 className="text-2xl font-bold text-slate-900">My Schedule</h3>
                
                {/* NEW: Calendar Month Navigation Controls */}
                <div className="flex items-center bg-sky-50 rounded-lg p-1">
                  <button onClick={handlePrevMonth} className="p-2 text-sky-700 hover:bg-sky-200 rounded-md transition-colors"><Icons.ChevronLeft className="h-5 w-5" /></button>
                  <span className="px-4 font-bold text-sky-900 min-w-[140px] text-center">{monthNames[calendarMonth]} {calendarYear}</span>
                  <button onClick={handleNextMonth} className="p-2 text-sky-700 hover:bg-sky-200 rounded-md transition-colors"><Icons.ChevronRight className="h-5 w-5" /></button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4 md:p-6">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-slate-400 text-xs sm:text-sm uppercase tracking-wider">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayObj, i) => {
                    if (!dayObj) return <div key={i} className="min-h-[80px] sm:min-h-[100px] p-2 bg-slate-50/50 rounded-lg border border-transparent"></div>;

                    const shift = mySchedule.find(s => s.date === dayObj.dateString);
                    let bgClass = "bg-white border-gray-100 hover:border-sky-300";
                    let content = null;

                    if (shift) {
                       // NEW: Made clicking a shift open the details modal
                       const timeUpper = shift.time.toUpperCase();
                       bgClass += " cursor-pointer shadow-sm hover:shadow-md"; // Added hover effects
                       
                       if (timeUpper.includes('OFF') || timeUpper.includes('PTO') || timeUpper.includes('VACATION')) {
                           bgClass = "bg-gray-100 border-gray-200 cursor-pointer";
                           content = <div className="mt-1 px-1 py-1 bg-gray-200 text-gray-600 font-bold text-[10px] sm:text-xs rounded-md text-center">OFF DUTY</div>;
                       } else if (timeUpper.includes('SICK') || shift.unit.toUpperCase().includes('SICK')) {
                           bgClass = "bg-orange-50 border-orange-200 cursor-pointer";
                           content = <div className="mt-1 px-1 py-1 bg-orange-100 text-orange-700 font-bold text-[10px] sm:text-xs rounded-md text-center">SICK LEAVE</div>;
                       } else if (timeUpper.includes('HOLIDAY')) {
                           bgClass = "bg-purple-50 border-purple-200 cursor-pointer";
                           content = <div className="mt-1 px-1 py-1 bg-purple-100 text-purple-700 font-bold text-[10px] sm:text-xs rounded-md text-center">HOLIDAY</div>;
                       } else {
                           bgClass = "bg-sky-50 border-sky-200 cursor-pointer";
                           content = (
                             <div className="mt-1 flex flex-col gap-1 pointer-events-none">
                               <span className="px-1 sm:px-2 py-1 bg-sky-100 text-sky-800 font-bold text-[9px] sm:text-xs rounded-md text-center whitespace-nowrap truncate" title={shift.time}>{shift.time}</span>
                               <span className="px-1 sm:px-2 py-1 bg-white text-slate-500 font-mono font-bold text-[9px] sm:text-[10px] rounded-md text-center border border-sky-100 truncate" title={shift.unit}>{shift.unit}</span>
                             </div>
                           );
                       }
                    }

                    const today = new Date();
                    const isToday = dayObj.dateString === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                    return (
                      <div 
                        key={i} 
                        onClick={() => shift && setSelectedShiftModal(shift)} // NEW: Triggers modal
                        className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg transition-all flex flex-col overflow-hidden ${bgClass} ${isToday ? 'ring-2 ring-sky-500 ring-offset-1' : ''}`}
                      >
                         <div className="flex justify-between items-center mb-1 pointer-events-none">
                            <span className={`text-xs sm:text-sm font-bold ${isToday ? 'text-white bg-sky-600 w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700'}`}>
                              {dayObj.day}
                            </span>
                         </div>
                         {content}
                      </div>
                    )
                  })}
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
                    <p className="text-2xl font-black text-slate-900">{userData?.sickEarned || '24.00'} hrs</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-teal-100 text-teal-600 rounded-xl mr-4">
                    <Icons.Palmtree className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Vacation (PTO) Available</p>
                    <p className="text-2xl font-black text-slate-900">{userData?.ptoEarned || '0.00'} hrs</p>
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
                    <label className="block text-sm font-bold text-slate-700 mb-1">Reason / Leave Type</label>
                    <select value={timeOffReason} onChange={(e) => setTimeOffReason(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                      <option value="Vacation">Vacation</option>
                      <option value="Personal Time Off">Personal Time Off</option>
                      <option value="Sick Time Off">Sick Time Off</option>
                      <option value="Bereavement">Bereavement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Pay Type</label>
                    <select value={timeOffPayType} onChange={(e) => setTimeOffPayType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                      <option value="Use Earned PTO">Use Earned PTO</option>
                      <option value="Use Earned Sick Hours">Use Earned Sick Hours</option>
                      <option value="Unpaid">Unpaid Time Off</option>
                    </select>
                  </div>
                  <button type="submit" disabled={timeOffStatus === 'submitting'} className="bg-sky-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-700 w-full disabled:opacity-50 mt-2">
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
                          <p className="text-xs font-semibold text-sky-600">{req.reason} ({req.payType})</p>
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

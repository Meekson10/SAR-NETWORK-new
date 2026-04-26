import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons, SarLogo } from '../components/Icons';
import { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const CHASE_PAYMENT_LINK = "https://checkout.chase.com/placeholder";

const HomePage = () => {
  const navigate = useNavigate();
  return (

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
          <button onClick={() => navigate('/services')} className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-sky-600 hover:bg-sky-700 md:py-4 md:text-xl shadow-lg shadow-sky-900/50 transition-all hover:-translate-y-1">
            <Icons.AlertTriangle className="mr-2 h-6 w-6" /> Request Help Now
          </button>
          <button onClick={() => navigate('/contact')} className="flex items-center justify-center px-8 py-4 border-2 border-slate-600 text-lg font-bold rounded-full text-gray-200 hover:bg-slate-800 hover:border-slate-500 md:py-4 md:text-xl transition-all">
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
};

export default HomePage;

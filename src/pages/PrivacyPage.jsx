import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons, SarLogo } from '../components/Icons';
import { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const CHASE_PAYMENT_LINK = "https://checkout.chase.com/placeholder";

const PrivacyPage = () => (
  <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg text-gray-600">
        <p className="mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-gray-200 pb-2">1. Information We Collect</h3>
        <p className="mb-4">To provide you with rapid and accurate roadside assistance, SAR Network collects the following information when you use our website or request service:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li><strong>Personal Details:</strong> First and last name, phone number, and email address.</li>
          <li><strong>Service Details:</strong> Vehicle make, model, color, and license plate (if provided).</li>
          <li><strong>Location Data:</strong> Exact GPS coordinates (only when you explicitly allow location access) or manually entered pickup/drop-off addresses.</li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-gray-200 pb-2">2. How We Use Your Information</h3>
        <p className="mb-4">We use the information we collect solely for business operations, including:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>Dispatching the nearest available tow truck or roadside technician to your location.</li>
          <li>Calling or texting you with ETA updates or to locate your vehicle.</li>
          <li>Processing payments and sending receipts.</li>
          <li>Internal record-keeping and quality assurance.</li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-gray-200 pb-2">3. Information Sharing</h3>
        <p className="mb-8">
          <strong>We do not sell or rent your personal information to third parties.</strong> Your information is only shared with our dispatchers, your assigned driver, and secure third-party payment processors strictly for the purpose of completing your requested service.
        </p>

        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-gray-200 pb-2">4. Data Security</h3>
        <p className="mb-8">
          We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. By using our service, you acknowledge and accept these inherent risks.
        </p>
      </div>
    </div>
  </div>
);


export default PrivacyPage;

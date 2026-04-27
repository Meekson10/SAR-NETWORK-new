import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Icons, SarLogo } from '../components/Icons';
import { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const CHASE_PAYMENT_LINK = "https://checkout.chase.com/placeholder";

const TermsPage = () => (
  <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
    <Helmet>
      <title>Terms of Service | SAR Network</title>
      <meta name="description" content="Read the SAR Network terms of service, dispatch fees, cancellation policies, and refund information." />
    </Helmet>
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8">Terms of Service & Cancellation Policy</h1>
      
      <div className="prose prose-lg text-gray-600">
        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-gray-200 pb-2">1. Dispatch & Cancellation Fees</h3>
        <p className="mb-4">
          When you request a service through SAR Network, a dispatcher immediately routes the closest available unit to your location. Because our trucks burn fuel and turn down other jobs to reach you, the following cancellation policy is strictly enforced:
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li><strong>Grace Period:</strong> You may cancel your request without penalty within <strong>5 minutes</strong> of the initial dispatch confirmation.</li>
          <li><strong>En Route Cancellation (Dry Run Fee):</strong> If you cancel your request after a driver has been dispatched and is en route to your location, a non-refundable <strong>$50.00 Dispatch Fee</strong> (also known as a Dry Run fee) will be charged to cover the operator's time and fuel.</li>
          <li><strong>Gone On Arrival (GOA):</strong> If our driver arrives at the designated location and you or the vehicle are no longer there, or if you refuse service upon arrival, you will be charged the <strong>Full Base Hook-Up Fee</strong>.</li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-gray-200 pb-2">2. Refunds</h3>
        <p className="mb-4">
          All services rendered by SAR Network are final. Once a vehicle has been hooked up, jumped, unlocked, or supplied with fuel, no refunds will be issued.
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-8">
          <li>If you experience an issue with the service provided, you must contact our management team within 24 hours to file a formal grievance.</li>
          <li>Refunds are not provided for delays caused by severe weather, severe traffic, or road closures beyond our control.</li>
        </ul>

        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-gray-200 pb-2">3. Payment Terms</h3>
        <p className="mb-8">
          Payment is due in full at the time service is rendered unless prior billing arrangements have been made (e.g., commercial accounts or direct insurance billing). We accept all major credit cards, debit cards, and mobile wallets. Our operators do not carry change for large cash transactions.
        </p>
      </div>
    </div>
  </div>
);

// --- PRIVACY POLICY PAGE ---

export default TermsPage;

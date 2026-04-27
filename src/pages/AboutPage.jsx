import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Icons, SarLogo } from '../components/Icons';
import { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const CHASE_PAYMENT_LINK = "https://checkout.chase.com/placeholder";

const AboutPage = () => (
  <div className="bg-white">
    <Helmet>
      <title>About Us | SAR Network</title>
      <meta name="description" content="Learn about SAR Network's history, mission, and how we became the nation's most reliable roadside recovery partner." />
    </Helmet>
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


export default AboutPage;

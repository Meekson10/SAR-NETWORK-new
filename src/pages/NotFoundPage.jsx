import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Icons } from '../components/Icons';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Page Not Found | SAR Network</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 text-sky-600">
          <Icons.AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-6">Page Not Found</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on the road.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <Icons.ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

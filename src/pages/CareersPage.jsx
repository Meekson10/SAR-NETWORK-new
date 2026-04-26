import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons, SarLogo } from '../components/Icons';
import { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const careerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  experience: z.string().min(10, 'Experience details must be at least 10 characters'),
  resumeLink: z.string().url('Invalid URL for resume')
});

const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('idle');
  const [liveJobs, setLiveJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(careerSchema)
  });

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

  const onSubmit = async (formData) => {
    setApplicationStatus('submitting');
    
    const payload = new FormData();
    payload.append("access_key", WEB3FORMS_KEY);
    payload.append("subject", `New Job Application: ${selectedJob.title}`);
    payload.append("First Name", formData.firstName);
    payload.append("Last Name", formData.lastName);
    payload.append("Email", formData.email);
    payload.append("Phone", formData.phone);
    payload.append("Experience", formData.experience);
    payload.append("Resume Link", formData.resumeLink);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: payload });
      const result = await response.json();
      
      if (result.success) {
        setApplicationStatus('success');
        reset();
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
        <button onClick={() => { setSelectedJob(null); reset(); }} className="flex items-center text-slate-500 hover:text-sky-600 font-medium mb-6 transition-colors">
          <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Careers
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-slate-900 px-8 py-6 text-white">
            <h2 className="text-2xl font-bold">Apply for {selectedJob.title}</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                <input {...register('firstName')} type="text" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                <input {...register('lastName')} type="text" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input {...register('email')} type="email" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input {...register('phone')} type="tel" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Experience / Relevant Skills</label>
              <textarea {...register('experience')} rows={4} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.experience ? 'border-red-500' : 'border-gray-300'}`} placeholder="Tell us about your driving experience, licenses, or dispatching background..."></textarea>
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Resume / Portfolio Link</label>
              <input 
                {...register('resumeLink')}
                type="url" 
                placeholder="Paste a link to your Google Drive, Dropbox, or LinkedIn profile..."
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 transition-all ${errors.resumeLink ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {errors.resumeLink && <p className="text-red-500 text-xs mt-1">{errors.resumeLink.message}</p>}
              <p className="text-xs text-gray-500 mt-2 font-medium">Note: Ensure your document link is set to "Anyone can view".</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
              <button type="button" onClick={() => { setSelectedJob(null); reset(); }} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={applicationStatus === 'submitting'} className="px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:opacity-70 transition-colors">
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


export default CareersPage;

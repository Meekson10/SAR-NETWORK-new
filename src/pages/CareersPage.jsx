import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// ----------------------------------------------------------------------
// ⚠️ GITHUB REPOSITORY INSTRUCTIONS ⚠️
// To use this file in your actual GitHub repository, UNCOMMENT these lines
// and delete the "MOCKS FOR PREVIEW" section below:
//
// import { Icons } from '../components/Icons';
// import { db } from '../services/firebase';
// import { collection, getDocs } from 'firebase/firestore';
// ----------------------------------------------------------------------

// --- START OF MOCKS FOR PREVIEW ---
const IconWrapper = ({ children, className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>;
const Icons = {
  CheckCircle: (p) => <IconWrapper {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>,
  MapPin: (p) => <IconWrapper {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></IconWrapper>,
  Clock: (p) => <IconWrapper {...p}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></IconWrapper>,
  Briefcase: (p) => <IconWrapper {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></IconWrapper>,
  ArrowLeft: (p) => <IconWrapper {...p}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></IconWrapper>,
  ChevronRight: (p) => <IconWrapper {...p}><polyline points="9 18 15 12 9 6"></polyline></IconWrapper>
};

const db = {};
const collection = () => ({});
const getDocs = async () => ({
  empty: false,
  forEach: (cb) => {
    [
      { id: '1', title: "Tow Truck Operator", type: "Full-time", loc: "Newark Area", pay: "$25-35/hr", desc: "We are looking for an experienced operator with a clean driving record. Responsibilities include responding to calls, safely towing vehicles, and providing basic roadside help." },
      { id: '2', title: "Dispatch Coordinator", type: "Full-time", loc: "Remote/Hybrid", pay: "$20-28/hr", desc: "Manage driver routing and customer requests. Must have excellent communication skills and be able to handle high-stress situations calmly." }
    ].forEach((job) => cb({ id: job.id, data: () => job }));
  }
});
// --- END OF MOCKS FOR PREVIEW ---

// Web3Forms key is hardcoded here to prevent any Vite build errors
const WEB3FORMS_KEY = "2f182922-a7f9-483f-afd0-73d11139bbe3";

const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('idle');
  const [liveJobs, setLiveJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Fetch the live job listings from Firebase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snap = await getDocs(collection(db, "jobs"));
        const fetched = [];
        snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
        setLiveJobs(fetched);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplicationStatus('submitting');
    
    const data = new FormData(e.target);
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `Job Application: ${selectedJob.title}`);

    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const result = await res.json();
      if (result.success) {
        setApplicationStatus('success');
        window.scrollTo(0, 0);
      } else {
        alert("Application failed to send. Please try again.");
        setApplicationStatus('idle');
      }
    } catch (error) {
      alert("Submission error. Please check your connection.");
      setApplicationStatus('idle');
    }
  };

  // --- VIEW 1: SUCCESS SCREEN ---
  if (applicationStatus === 'success') {
    return (
      <HelmetProvider>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <Helmet><title>Application Submitted | SAR Network</title></Helmet>
          <div className="bg-green-50 p-10 rounded-3xl border border-green-200 shadow-sm">
            <Icons.CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-green-800 mb-3">Applied Successfully!</h2>
            <p className="text-green-700 font-medium">We'll review your application for the <strong>{selectedJob?.title}</strong> position and reach out shortly.</p>
            <button 
              onClick={() => { setSelectedJob(null); setIsApplying(false); setApplicationStatus('idle'); }} 
              className="mt-8 text-green-700 font-black hover:underline uppercase text-sm tracking-widest"
            >
              Back to Careers
            </button>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  // --- VIEW 2: JOB DESCRIPTION DETAILS ---
  if (selectedJob && !isApplying) {
    return (
      <HelmetProvider>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <Helmet><title>{selectedJob.title} - Careers | SAR Network</title></Helmet>
          
          <button 
            onClick={() => setSelectedJob(null)} 
            className="flex items-center text-slate-400 hover:text-sky-600 font-black mb-8 transition-colors uppercase text-sm tracking-widest"
          >
            <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Listings
          </button>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header section with Job Title and basic tags */}
            <div className="bg-slate-900 p-12 text-white relative">
               <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">{selectedJob.title}</h2>
               <div className="flex flex-wrap gap-8 text-slate-400 text-sm font-black uppercase tracking-widest">
                 <span className="flex items-center"><Icons.MapPin className="h-5 w-5 mr-2 text-sky-500" /> {selectedJob.loc}</span>
                 <span className="flex items-center"><Icons.Clock className="h-5 w-5 mr-2 text-sky-500" /> {selectedJob.type}</span>
                 <span className="text-green-400 font-black">Pay: {selectedJob.pay}</span>
               </div>
            </div>
            
            {/* Detailed Description section */}
            <div className="p-12">
              <h3 className="text-xl font-black text-slate-900 mb-6 border-b-4 border-sky-500 w-fit pb-2">Description & Requirements</h3>
              
              {/* whitespace-pre-wrap ensures paragraph spacing from your Admin dashboard renders properly */}
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap mb-12 font-medium">
                {selectedJob.desc || "We are looking for a dedicated professional to join our team. Apply below to learn more!"}
              </p>
              
              {/* Application Call-to-action box */}
              <div className="bg-sky-50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between border border-sky-100">
                <div className="mb-6 md:mb-0">
                  <h4 className="font-black text-slate-900 text-xl mb-1">Ready to join the network?</h4>
                  <p className="text-slate-600 font-medium">Our hiring team typically reviews applications in 3-5 business days.</p>
                </div>
                <button 
                  onClick={() => setIsApplying(true)} 
                  className="bg-sky-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-sky-700 shadow-xl shadow-sky-200 transition-all active:scale-95 shrink-0"
                >
                  Start Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  // --- VIEW 3: APPLICATION FORM ---
  if (selectedJob && isApplying) {
    return (
      <HelmetProvider>
        <div className="max-w-3xl mx-auto py-12 px-4">
          <Helmet><title>Apply for {selectedJob.title} | SAR Network</title></Helmet>
          
          <button 
            onClick={() => setIsApplying(false)} 
            className="flex items-center text-slate-400 hover:text-sky-600 font-black mb-8 transition-colors uppercase text-sm tracking-widest"
          >
            <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Description
          </button>
          
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-10 border border-gray-100">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Apply: {selectedJob.title}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">First Name</label>
                  <input required name="First Name" className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Last Name</label>
                  <input required name="Last Name" className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-800" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                  <input required name="Email" type="email" className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Phone Number</label>
                  <input required name="Phone" type="tel" className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-800" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Experience / Message</label>
                <textarea required name="Experience" rows={5} className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-800" placeholder="Briefly describe your relevant background..."></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Link to Resume</label>
                <input required name="Resume Link" type="url" placeholder="Google Drive, Dropbox, or LinkedIn Link..." className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-sky-500 outline-none transition-all font-bold text-slate-800" />
              </div>
              
              <button 
                type="submit" 
                disabled={applicationStatus === 'submitting'} 
                className="w-full bg-sky-600 text-white py-5 rounded-2xl font-black hover:bg-sky-700 disabled:opacity-50 shadow-2xl shadow-sky-100 transition-all active:scale-[0.98]"
              >
                {applicationStatus === 'submitting' ? "Sending Application..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  // --- VIEW 4: MAIN JOB GRID LISTINGS ---
  return (
    <HelmetProvider>
      <div className="max-w-7xl mx-auto py-20 px-4">
        <Helmet><title>Careers | SAR Network</title></Helmet>
        
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">Join the SAR Network Team</h2>
          <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto">We are looking for dedicated professionals to help us keep drivers safe and moving.</p>
        </div>

        {isLoadingJobs ? (
          <div className="text-center py-20 text-slate-300 font-black text-3xl animate-pulse uppercase tracking-widest">
            Loading Live Openings...
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {liveJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                    <Icons.Briefcase className="h-6 w-6" />
                  </div>
                  <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-green-200">
                    Hiring
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4">{job.title}</h3>
                
                <div className="space-y-3 text-sm text-slate-500 font-bold mb-8 flex-grow">
                   <p className="flex items-center"><Icons.MapPin className="h-4 w-4 mr-3 text-sky-500" /> {job.loc}</p>
                   <p className="flex items-center font-black text-slate-800 tracking-wide">Pay: {job.pay}</p>
                </div>
                
                <button 
                  onClick={() => { setSelectedJob(job); setIsApplying(false); window.scrollTo(0, 0); }} 
                  className="w-full py-4 border-2 border-sky-600 text-sky-600 font-black rounded-2xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                >
                  View Details & Apply
                </button>
              </div>
            ))}
            
            {/* General Interest Application Card */}
            <div className="bg-slate-900 rounded-3xl p-10 text-center text-white flex flex-col justify-center border-4 border-slate-800 shadow-2xl">
              <h3 className="text-2xl font-black mb-3">Don't see your role?</h3>
              <p className="text-sm text-slate-400 font-bold mb-8 leading-relaxed">
                Send us a general application and we'll keep your profile in our candidate pool.
              </p>
              <button 
                onClick={() => {
                  setSelectedJob({
                    title: "General Application", 
                    desc: "We are always on the lookout for talented drivers, dispatchers, and support staff. Submit your information and we will reach out when a position opens up that fits your background.", 
                    loc: "Various Locations", 
                    type: "Full or Part Time", 
                    pay: "Competitive"
                  });
                  window.scrollTo(0, 0);
                }} 
                className="text-sky-400 font-black hover:text-sky-300 uppercase text-xs tracking-widest flex items-center justify-center w-full"
              >
                Submit General Interest <Icons.ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default CareersPage;

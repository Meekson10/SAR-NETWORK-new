import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons, SarLogo } from '../components/Icons';
import { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const ServiceRequestPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ type: '', location: '', phone: '', vehicle: '' });
  
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));
        if (snap.empty) {
          const defaults = [
            { label: 'Towing', icon: 'Truck', price: 150, paymentLink: 'https://buy.stripe.com/test_dRm3cw1hWgoKdK54H45Rm00' },
            { label: 'Flat Tire', icon: 'AlertTriangle', price: 100, paymentLink: 'https://buy.stripe.com/test_6oUaEYd0E8Wi6hD3D05Rm01' },
            { label: 'Lockout', icon: 'Key', price: 85, paymentLink: 'https://buy.stripe.com/test_dRm3cwf8Ma0m9tP8Xk5Rm02' },
            { label: 'Dead Battery', icon: 'Battery', price: 75, paymentLink: 'https://buy.stripe.com/test_00w6oI1hWb4qdK58Xk5Rm03' },
            { label: 'Out of Gas', icon: 'Fuel', price: 90, paymentLink: 'https://buy.stripe.com/test_9B6fZie4IegC8pLgpM5Rm04' }
          ];
          const fetched = [];
          for (const s of defaults) {
            const docRef = await addDoc(collection(db, "services"), s);
            fetched.push({ id: docRef.id, ...s });
          }
          setServices(fetched);
        } else {
          const fetched = [];
          snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
          fetched.sort((a,b) => b.price - a.price);
          setServices(fetched);
        }
      } catch(e) {
          console.log(e);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const getServicePrice = (serviceLabel) => {
    const service = services.find(s => s.label === serviceLabel);
    return service ? service.price : 100;
  };

  const handlePaymentSubmit = async (e) => { 
    e.preventDefault(); 
    setIsSubmitting(true);

    const totalCost = getServicePrice(formData.type);

    const data = new FormData();
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "🚨 NEW TOWING REQUEST (PENDING STRIPE PAYMENT)");
    data.append("Service Type", formData.type);
    data.append("Location", formData.location);
    data.append("Vehicle Details", formData.vehicle);
    data.append("Phone Number", formData.phone);
    data.append("Total Cost", `$${totalCost.toFixed(2)}`);

    try {
      // 1. Send the dispatch info to the Admin
      await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      
      // 2. Redirect the user securely to Stripe
      const selectedService = services.find(s => s.label === formData.type);
      const paymentUrl = selectedService?.paymentLink || 'https://buy.stripe.com/test_dRm3cw1hWgoKdK54H45Rm00'; // fallback to towing
      window.open(paymentUrl, '_blank');
      
      // 3. Show Success Screen
      setSubmitted(true);
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
    );
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-green-50 rounded-2xl text-center border border-green-200 shadow-lg">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.CheckCircle className="h-8 w-8" /></div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Request Processed!</h2>
        <p className="text-green-700 mb-6">If the secure payment window did not open, please ensure pop-ups are allowed. A dispatcher is reviewing your request and will call you at {formData.phone} shortly.</p>
        <button onClick={() => { setSubmitted(false); setStep(1); setFormData({ type: '', location: '', phone: '', vehicle: '' }); }} className="mt-6 text-green-700 font-bold hover:underline">Start New Request</button>
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
          <span className="font-semibold text-slate-700 text-sm">Step {step} of 4</span>
          <div className="flex space-x-2">
            <div className={`h-2 w-6 sm:w-8 rounded-full transition-colors ${step >= 1 ? 'bg-sky-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-6 sm:w-8 rounded-full transition-colors ${step >= 2 ? 'bg-sky-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-6 sm:w-8 rounded-full transition-colors ${step >= 3 ? 'bg-sky-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-6 sm:w-8 rounded-full transition-colors ${step >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">What do you need help with?</h3>
              {isLoadingServices ? (
                <div className="py-8 space-y-4">
                  {[1, 2, 3].map((skeleton) => (
                    <div key={skeleton} className="animate-pulse bg-white border border-gray-100 p-6 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-200 rounded"></div>
                          <div className="h-3 w-48 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {services.map((s) => {
                    const SrvIcon = Icons[s.icon] || Icons.Wrench;
                    return (
                      <button key={s.id} onClick={() => { setFormData({...formData, type: s.label}); setStep(2); }} className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all group relative overflow-hidden">
                        <SrvIcon className="h-8 w-8 text-slate-400 group-hover:text-sky-600 mb-3" />
                        <span className="font-semibold text-slate-700 group-hover:text-sky-700">{s.label}</span>
                        <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                          ${s.price.toFixed(0)}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Your Location</label>
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
                  className="mt-3 text-sky-600 text-sm font-bold flex items-center hover:text-sky-700 disabled:opacity-50 transition-opacity bg-sky-50 px-3 py-2 rounded-lg w-full justify-center border border-sky-100"
                >
                  <Icons.MapPin className="h-4 w-4 mr-2" /> 
                  {isLocating ? "Finding your exact location..." : "Share my exact GPS location"}
                </button>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-slate-600 py-3 rounded-lg font-bold hover:bg-gray-200">Back</button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!formData.location}
                  className="w-2/3 bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 disabled:opacity-50"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Vehicle Details</label>
                <input required type="text" placeholder="2018 Toyota Camry (Silver)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                <input required type="tel" placeholder="(555) 123-4567" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-gray-100 text-slate-600 py-3 rounded-lg font-bold hover:bg-gray-200">Back</button>
                <button type="submit" className="w-2/3 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 flex justify-center items-center">
                  Continue to Payment <Icons.ChevronRight className="ml-1 h-5 w-5" />
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-xl mb-6">
                <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Request Summary</h4>
                
                <div className="space-y-3 text-sm text-slate-600 mb-6">
                  <p className="flex justify-between items-center"><span className="font-medium text-slate-500">Service ({formData.type}):</span> <span className="font-bold text-slate-800">${getServicePrice(formData.type).toFixed(2)}</span></p>
                  <p className="flex justify-between items-center"><span className="font-medium text-slate-500">Location:</span> <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate" title={formData.location}>{formData.location}</span></p>
                  <p className="flex justify-between items-center"><span className="font-medium text-slate-500">Vehicle:</span> <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate" title={formData.vehicle}>{formData.vehicle}</span></p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center text-lg mb-3">
                    <span className="font-bold text-slate-800">Total Service Cost</span>
                    <span className="font-black text-slate-900">${getServicePrice(formData.type).toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mt-6 text-xs font-medium border border-blue-100 flex items-start">
                  <Icons.Shield className="h-5 w-5 mr-3 shrink-0 text-blue-600 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="block mb-1 text-sm">Secure Stripe Checkout.</strong> 
                    Clicking the button below will redirect you to our official Stripe payment portal to securely submit your payment for the service.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setStep(3)} className="w-full sm:w-1/3 bg-gray-100 text-slate-600 py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors">Back</button>
                <button type="submit" disabled={isSubmitting} className="w-full sm:w-2/3 bg-blue-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all flex justify-center items-center">
                  {isSubmitting ? (
                    <span className="flex items-center animate-pulse">Redirecting to Stripe...</span>
                  ) : (
                    <><Icons.CreditCard className="h-5 w-5 mr-2" /> Proceed to Stripe Checkout</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


export default ServiceRequestPage;

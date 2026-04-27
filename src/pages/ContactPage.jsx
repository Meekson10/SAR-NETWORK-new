import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Icons } from '../components/Icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

const ContactPage = () => {
  const [status, setStatus] = useState("idle");

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (formData) => {
    setStatus("submitting");

    const payload = new FormData();
    payload.append("access_key", WEB3FORMS_KEY);
    payload.append("subject", "New General Contact Message");
    payload.append("First Name", formData.firstName);
    payload.append("Last Name", formData.lastName);
    payload.append("Email", formData.email);
    if (formData.phone) payload.append("Phone", formData.phone);
    payload.append("Message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: payload });
      const result = await response.json();
      
      if (result.success) {
        setStatus("success");
        reset();
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
      <Helmet>
        <title>Contact Us | SAR Network - Emergency Towing & Roadside Assistance</title>
        <meta name="description" content="Get in touch with SAR Network for any questions, feedback, or emergency roadside assistance." />
      </Helmet>

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input id="firstName" {...register('firstName')} type="text" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input id="lastName" {...register('lastName')} type="text" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input id="email" {...register('email')} type="email" className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input id="phone" {...register('phone')} type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea id="message" {...register('message')} rows={4} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button disabled={status === "submitting"} type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors">
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

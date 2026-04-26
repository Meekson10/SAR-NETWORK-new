import React from 'react';

const IconWrapper = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);

export const Icons = {
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
  Bell: (p) => <IconWrapper {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></IconWrapper>,
  Wrench: (p) => <IconWrapper {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></IconWrapper>,
  Download: (p) => <IconWrapper {...p}><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></IconWrapper>
};

export const SarLogo = ({ className = "h-12 w-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="#2C3E50" strokeWidth="6" />
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M50 10 V90" stroke="#2C3E50" strokeWidth="4" />
    <path d="M20 30 Q50 30 80 30" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M20 70 Q50 70 80 70" stroke="#2C3E50" strokeWidth="4" fill="none" />
    <path d="M15 75 Q 40 95 90 45 Q 60 90 15 75 Z" fill="#0EA5E9" />
  </svg>
);

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons, SarLogo } from '../components/Icons';
import { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { query, limit, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';


import toast from 'react-hot-toast';
import { AdminDashboardView } from '../features/portal/AdminDashboardView';
import { FleetTracker } from '../features/portal/FleetTracker';
import { HRDirectory } from '../features/portal/HRDirectory';
import { ScheduleManager } from '../features/portal/ScheduleManager';
import { JobManager } from '../features/portal/JobManager';
import { ServiceManager } from '../features/portal/ServiceManager';
import { TimeOffManager } from '../features/portal/TimeOffManager';
import { EmployeeProfile } from '../features/portal/EmployeeProfile';

const customConfirm = (message) => new Promise((resolve) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="font-bold text-slate-800">{message}</p>
      <div className="flex gap-2 justify-end">
        <button className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-600 transition-colors" onClick={() => { toast.dismiss(t.id); resolve(true); }}>Confirm</button>
        <button className="bg-slate-200 text-slate-800 px-3 py-1 rounded text-sm font-bold hover:bg-slate-300 transition-colors" onClick={() => { toast.dismiss(t.id); resolve(false); }}>Cancel</button>
      </div>
    </div>
  ), { duration: Infinity });
});

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const CHASE_PAYMENT_LINK = "https://checkout.chase.com/placeholder";

const EmployeePortal = () => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // User Data State
  const [userData, setUserData] = useState(null);

  // --- ADMIN SPECIFIC STATE ---
  const [adminActiveTab, setAdminActiveTab] = useState('dashboard');
  const [employeeList, setEmployeeList] = useState([]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createMessage, setCreateMessage] = useState(null);
  const [expandedEmpId, setExpandedEmpId] = useState(null);
  
  // Admin Schedule Manager States
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [empSchedule, setEmpSchedule] = useState([]);
  const [shiftDate, setShiftDate] = useState('');
  const [shiftTime, setShiftTime] = useState('');
  const [shiftUnit, setShiftUnit] = useState('');

  // Admin Time Off Manager States
  const [allTimeOffRequests, setAllTimeOffRequests] = useState([]);

  // Admin Job Manager States
  const [adminJobs, setAdminJobs] = useState([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobType, setNewJobType] = useState('Full-time');
  const [newJobLoc, setNewJobLoc] = useState('');
  const [newJobPay, setNewJobPay] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Admin Service Pricing Manager States
  const [adminServices, setAdminServices] = useState([]);
  const [newServiceLabel, setNewServiceLabel] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState('Truck');
  const [newServicePrice, setNewServicePrice] = useState('');

  // --- REGULAR EMPLOYEE SPECIFIC STATE ---
  const [empTab, setEmpTab] = useState('dashboard');
  const [profileAddress, setProfileAddress] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileRouting, setProfileRouting] = useState('');
  const [profileAccount, setProfileAccount] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  
  const [mySchedule, setMySchedule] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedShiftModal, setSelectedShiftModal] = useState(null);
  
  const [timeOffStart, setTimeOffStart] = useState('');
  const [timeOffEnd, setTimeOffEnd] = useState('');
  const [timeOffReason, setTimeOffReason] = useState('Vacation');
  const [timeOffPayType, setTimeOffPayType] = useState('Use Earned PTO');
  const [timeOffStatus, setTimeOffStatus] = useState('');
  const [timeOffHistory, setTimeOffHistory] = useState([]);
  
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchEmployees();
      fetchAllTimeOffRequests();
      fetchAdminJobs();
      fetchAdminServices(); 
    }
    if (userData?.role !== 'admin' && user && empTab === 'timeoff') {
      fetchTimeOffHistory();
    }
    if (userData?.role !== 'admin' && user && empTab === 'schedule') {
      fetchMySchedule();
    }
    if (userData?.role !== 'admin' && user && empTab === 'dashboard') {
      fetchMyNotifications();
    }
  }, [adminActiveTab, userData, empTab]);

  useEffect(() => {
    if (adminActiveTab === 'scheduleManager' && selectedEmpId) {
      fetchEmpSchedule(selectedEmpId);
    }
  }, [selectedEmpId, adminActiveTab]);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users"), limit(20)));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setEmployeeList(users);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchEmpSchedule = async (uid) => {
    if (!uid) return setEmpSchedule([]);
    try {
      const snap = await getDocs(query(collection(db, "users", uid, "schedules"), limit(20)));
      const shifts = [];
      snap.forEach(doc => shifts.push({ id: doc.id, ...doc.data() }));
      shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEmpSchedule(shifts);
    } catch (error) {
      console.error("Error fetching admin schedule:", error);
    }
  };

  const fetchAllTimeOffRequests = async () => {
    try {
      const usersSnap = await getDocs(query(collection(db, "users"), limit(20)));
      let requests = [];
      for (const userDoc of usersSnap.docs) {
        const uData = userDoc.data();
        const timeOffSnap = await getDocs(collection(db, "users", userDoc.id, "time_off"));
        timeOffSnap.forEach(reqDoc => {
          requests.push({
            id: reqDoc.id,
            userId: userDoc.id,
            userName: uData.name || 'Unknown Driver',
            ...reqDoc.data()
          });
        });
      }
      requests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      setAllTimeOffRequests(requests);
    } catch (error) {
      console.error("Error fetching all time off:", error);
    }
  };

  const fetchMySchedule = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(query(collection(db, "users", user.uid, "schedules"), limit(20)));
      const shifts = [];
      snap.forEach(doc => shifts.push({ id: doc.id, ...doc.data() }));
      shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
      setMySchedule(shifts);
    } catch (error) {
      console.error("Error fetching my schedule:", error);
    }
  };

  const fetchTimeOffHistory = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users", user.uid, "time_off"), limit(20)));
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      setTimeOffHistory(requests);
    } catch (error) {
      console.error("Error fetching time off:", error);
    }
  };

  const fetchAdminJobs = async () => {
    try {
      const snap = await getDocs(collection(db, "jobs"));
      const j = [];
      snap.forEach(doc => j.push({ id: doc.id, ...doc.data() }));
      j.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setAdminJobs(j);
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
    }
  };
  
  const fetchMyNotifications = async () => {
    if(!user) return;
    try {
      const snap = await getDocs(collection(db, "users", user.uid, "notifications"));
      const notifs = [];
      snap.forEach(doc => notifs.push({ id: doc.id, ...doc.data() }));
      notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const fetchAdminServices = async () => {
    try {
      const snap = await getDocs(collection(db, "services"));
      if (snap.empty) {
        const defaults = [
          { label: 'Towing', icon: 'Truck', price: 150 },
          { label: 'Flat Tire', icon: 'AlertTriangle', price: 100 },
          { label: 'Lockout', icon: 'Key', price: 85 },
          { label: 'Dead Battery', icon: 'Battery', price: 75 },
          { label: 'Out of Gas', icon: 'Fuel', price: 90 }
        ];
        for (const s of defaults) {
          await addDoc(collection(db, "services"), s);
        }
        const newSnap = await getDocs(collection(db, "services"));
        const newS = [];
        newSnap.forEach(doc => newS.push({ id: doc.id, ...doc.data() }));
        setAdminServices(newS.sort((a,b) => b.price - a.price));
      } else {
        const s = [];
        snap.forEach(doc => s.push({ id: doc.id, ...doc.data() }));
        setAdminServices(s.sort((a,b) => b.price - a.price));
      }
    } catch(e) { 
      console.error("Error fetching services", e); 
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "services"), {
        label: newServiceLabel,
        icon: newServiceIcon,
        price: Number(newServicePrice)
      });
      setNewServiceLabel('');
      setNewServicePrice('');
      setNewServiceIcon('Truck');
      fetchAdminServices();
      toast.success("Service added successfully.");
    } catch(e) { 
      toast.error("Error adding service"); 
    }
  };

  const handleDeleteService = async (id) => {
    if (!(await customConfirm("Delete this service? This will permanently remove it from the customer request page."))) return;
    try {
      await deleteDoc(doc(db, "services", id));
      fetchAdminServices();
    } catch(e) {
      toast.error("Error deleting service");
    }
  };

  const handleEditServicePrice = async (id, currentPrice) => {
    const newPrice = prompt("Enter the new base price for this service (numbers only):", currentPrice);
    if (newPrice && !isNaN(newPrice)) {
      try {
        await updateDoc(doc(db, "services", id), { price: Number(newPrice) });
        fetchAdminServices();
      } catch(e) { 
        toast.error("Error updating price"); 
      }
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setIsCreatingUser(true);
    setCreateMessage(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newEmpEmail, newEmpPassword);
      const newUserId = userCredential.user.uid;
      
      await setDoc(doc(db, "users", newUserId), {
        name: newEmpName,
        email: newEmpEmail,
        role: 'employee',
        status: 'Active',
        workStatus: 'Clocked Out',
        createdAt: new Date().toISOString()
      });
      
      await signOut(secondaryAuth);
      
      setCreateMessage({ type: 'success', text: `Successfully created account for ${newEmpName}!` });
      setNewEmpName('');
      setNewEmpEmail('');
      setNewEmpPassword('');
      fetchEmployees();
    } catch (error) {
      setCreateMessage({ type: 'error', text: error.message });
    }
    setIsCreatingUser(false);
  };

  const handleToggleEmployeeStatus = async (empId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await updateDoc(doc(db, "users", empId), { status: newStatus });
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to update employee status.");
    }
  };

  const handleDeleteEmployee = async (empId, empName) => {
    const confirmText = prompt(`SECURITY WARNING: You are about to permanently delete the account for ${empName || 'this employee'}.\n\nTo confirm, please type the word DELETE below:`);
    if (confirmText !== "DELETE") {
      toast.error("Account deletion cancelled.");
      return;
    }
    try {
      await deleteDoc(doc(db, "users", empId));
      fetchEmployees();
      toast.success(`${empName || 'Employee'} has been successfully deleted.`);
    } catch (error) {
      toast.error("Failed to delete employee.");
    }
  };

  const handlePasswordReset = async (empEmail) => {
    if(!(await customConfirm(`Are you sure you want to send a password reset email to ${empEmail}?`))) return;
    try {
      await sendPasswordResetEmail(auth, empEmail);
      toast.success("Password reset email sent successfully! The driver can use the link in their email to set a new password.");
    } catch (error) {
      toast.error("Failed to send password reset email. Ensure the email address is correct.");
    }
  };

  const handleAddShift = async (e) => {
    e.preventDefault();
    if(!selectedEmpId) return;
    try {
      await addDoc(collection(db, "users", selectedEmpId, "schedules"), {
        date: shiftDate,
        time: shiftTime,
        unit: shiftUnit,
        status: 'Scheduled'
      });
      setShiftDate(''); setShiftTime(''); setShiftUnit('');
      fetchEmpSchedule(selectedEmpId);
    } catch (error) {
      toast.error("Failed to assign shift.");
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if(!(await customConfirm("Remove this shift?"))) return;
    try {
      await deleteDoc(doc(db, "users", selectedEmpId, "schedules", shiftId));
      fetchEmpSchedule(selectedEmpId);
    } catch (error) {
      toast.error("Failed to remove shift.");
    }
  };

  const handleTimeOffAction = async (userId, reqId, newStatus, reqObj) => {
    try {
      await updateDoc(doc(db, "users", userId, "time_off", reqId), { status: newStatus });

      if (newStatus === 'Approved') {
        const start = new Date(reqObj.startDate);
        const end = new Date(reqObj.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const hoursToDeduct = days > 0 ? days * 8 : 8;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const uData = userSnap.data();
          if (reqObj.payType === 'Use PTO' || reqObj.payType === 'Use Earned PTO') {
            const currentPto = parseFloat(uData.ptoEarned || 0);
            await updateDoc(userRef, { ptoEarned: Math.max(0, currentPto - hoursToDeduct).toFixed(2) });
          } else if (reqObj.payType === 'Use Sick Hours' || reqObj.payType === 'Use Earned Sick Hours') {
            const currentSick = parseFloat(uData.sickEarned || 24);
            await updateDoc(userRef, { sickEarned: Math.max(0, currentSick - hoursToDeduct).toFixed(2) });
          }
        }
      }
      
      await addDoc(collection(db, "users", userId, "notifications"), {
        message: `Your time-off request for ${reqObj.startDate} has been ${newStatus.toUpperCase()}.`,
        createdAt: new Date().toISOString(),
        read: false
      });
      
      toast.success(`Request has been successfully ${newStatus.toUpperCase()} and the employee has been notified.`);
      fetchAllTimeOffRequests();
    } catch (error) {
      toast.error("Failed to update request status: " + error.message);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "jobs"), {
        title: newJobTitle,
        desc: newJobDesc,
        type: newJobType,
        loc: newJobLoc,
        pay: newJobPay,
        createdAt: new Date().toISOString()
      });
      setNewJobTitle('');
      setNewJobDesc('');
      setNewJobType('Full-time');
      setNewJobLoc('');
      setNewJobPay('');
      fetchAdminJobs();
      toast.success("Job posted successfully!");
    } catch (error) {
      toast.error("Failed to post job.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if(!(await customConfirm("Are you sure you want to permanently delete this job posting?"))) return;
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      fetchAdminJobs();
    } catch (error) {
      toast.error("Failed to delete job.");
    }
  };

  // Download QuickBooks CSV
  const handleExportQuickBooks = () => {
    if(employeeList.length === 0) {
      toast.error("No employees to export.");
      return;
    }
    
    const headers = ["Employee Name", "Email", "Total Hours Worked", "PTO Earned", "Sick Available"];
    const rows = employeeList.filter(emp => emp.role !== 'admin').map(emp => [
      `"${emp.name || ''}"`,
      `"${emp.email || ''}"`,
      emp.hoursWorked || '0.00',
      emp.ptoEarned || '0.00',
      emp.sickEarned || '24.00'
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SAR_Network_Payroll_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClockToggle = async () => {
    if (!user) return;
    const isCurrentlyClockedIn = userData?.workStatus === 'Clocked In';
    const newStatus = isCurrentlyClockedIn ? 'Clocked Out' : 'Clocked In';
    const nowISO = new Date().toISOString();
    
    let updates = { 
      workStatus: newStatus,
      lastPunch: nowISO 
    };

    if (isCurrentlyClockedIn && userData.lastPunch) {
      const startTime = new Date(userData.lastPunch).getTime();
      const endTime = new Date(nowISO).getTime();
      
      if (!isNaN(startTime)) {
        const hoursElapsed = (endTime - startTime) / (1000 * 60 * 60);
        const currentHours = parseFloat(userData.hoursWorked || 0) + hoursElapsed;
        
        const currentPto = parseFloat(userData.ptoEarned || 0) + (hoursElapsed * 0.02);
        const currentSick = parseFloat(userData.sickEarned || 24) + (hoursElapsed * 0.02);

        updates.hoursWorked = currentHours.toFixed(2);
        updates.ptoEarned = currentPto.toFixed(2);
        updates.sickEarned = currentSick.toFixed(2);
      }
    }

    try {
      await updateDoc(doc(db, "users", user.uid), updates);
      setUserData({ ...userData, ...updates });
    } catch (error) {
      toast.error("Failed to clock in/out. Check connection.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileStatus('saving');
    try {
      await updateDoc(doc(db, "users", user.uid), {
        address: profileAddress,
        phone: profilePhone,
        banking: { routing: profileRouting, account: profileAccount }
      });

      const alertData = new FormData();
      alertData.append("access_key", WEB3FORMS_KEY);
      alertData.append("subject", `🚨 PROFILE UPDATE: ${userData?.name || user.email}`);
      alertData.append("Employee", userData?.name || user.email);
      alertData.append("New Address", profileAddress || "N/A");
      alertData.append("New Phone", profilePhone || "N/A");
      alertData.append("Banking Info", profileRouting || profileAccount ? "Updated (Log in to view securely)" : "No Change");
      
      fetch("https://api.web3forms.com/submit", { method: "POST", body: alertData }).catch(e => console.log("Email alert failed", e));

      setUserData({ ...userData, address: profileAddress, phone: profilePhone, banking: { routing: profileRouting, account: profileAccount } });
      setProfileStatus('saved');
      setTimeout(() => setProfileStatus(''), 3000);
    } catch (error) {
      setProfileStatus('error');
    }
  };

  const handleTimeOffSubmit = async (e) => {
    e.preventDefault();
    setTimeOffStatus('submitting');
    try {
      await addDoc(collection(db, "users", user.uid, "time_off"), {
        startDate: timeOffStart,
        endDate: timeOffEnd,
        reason: timeOffReason,
        payType: timeOffPayType,
        status: 'Pending Approval',
        submittedAt: new Date().toISOString()
      });

      const alertData = new FormData();
      alertData.append("access_key", WEB3FORMS_KEY);
      alertData.append("subject", `🚨 TIME OFF REQUEST: ${userData?.name || user.email}`);
      alertData.append("Employee", userData?.name || user.email);
      alertData.append("Dates Requested", `${timeOffStart} to ${timeOffEnd}`);
      alertData.append("Reason", timeOffReason);
      alertData.append("Pay Type", timeOffPayType);
      
      fetch("https://api.web3forms.com/submit", { method: "POST", body: alertData }).catch(e => console.log("Email alert failed", e));

      setTimeOffStatus('success');
      setTimeOffStart(''); setTimeOffEnd(''); setTimeOffReason('Vacation'); setTimeOffPayType('Use Earned PTO');
      fetchTimeOffHistory();
      setTimeout(() => setTimeOffStatus(''), 3000);
    } catch (error) {
      setTimeOffStatus('error');
    }
  };
  
  const handleMarkNotificationRead = async (notifId) => {
    try {
      await updateDoc(doc(db, "users", user.uid, "notifications", notifId), { read: true });
      fetchMyNotifications();
    } catch (e) { console.log(e); }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.status === 'Inactive') {
            toast.error("This account has been deactivated by an Administrator.");
            await signOut(auth);
            return;
          }

          setUserData(data);
          if (data.address) setProfileAddress(data.address);
          if (data.phone) setProfilePhone(data.phone);
          if (data.banking) {
            setProfileRouting(data.banking.routing || '');
            setProfileAccount(data.banking.account || '');
          }
        } else {
          setUserData({ role: 'employee', name: currentUser.email, workStatus: 'Clocked Out' });
        }
      } else {
        setUserData(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError("Invalid email or password.");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loadingAuth) {
    return <div className="flex justify-center py-20"><p className="text-gray-500 font-bold animate-pulse">Connecting to Server...</p></div>;
  }

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(calendarYear, calendarMonth, i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    calendarDays.push({ day: i, dateString: `${yyyy}-${mm}-${dd}` });
  }
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const handlePrevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else { setCalendarMonth(m => m - 1); }
  }
  const handleNextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else { setCalendarMonth(m => m + 1); }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6"><SarLogo className="h-16 w-16" /></div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Employee Secure Login</h2>
          
          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-semibold border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" 
                placeholder="you@sarnetwork.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              disabled={isLoggingIn}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? "Authenticating..." : "Access Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (userData?.role === 'admin') {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8 bg-sky-900 text-white p-6 rounded-xl shadow-lg">
          <div>
            <h2 className="text-2xl font-black flex items-center"><Icons.Shield className="h-6 w-6 mr-2" /> Admin Dashboard</h2>
            <p className="text-sky-200 text-sm">Welcome back, Boss. Logged in as: {user.email}</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => setAdminActiveTab('profile')} className="flex items-center px-4 py-2 bg-sky-800 hover:bg-sky-700 rounded-lg transition-colors font-bold text-sm">
              <Icons.User className="h-4 w-4 mr-2" /> Profile
            </button>
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-sky-800 hover:bg-red-600 rounded-lg transition-colors font-bold text-sm">
              <Icons.LogOut className="h-4 w-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>

        {adminActiveTab === 'dashboard' ? (
          <AdminDashboardView 
            allTimeOffRequests={allTimeOffRequests}
            employeeList={employeeList}
            adminJobs={adminJobs}
            adminServices={adminServices}
            setAdminActiveTab={setAdminActiveTab}
          />
        ) : (
          <div className="space-y-6">
            <button onClick={() => setAdminActiveTab('dashboard')} className="flex items-center text-slate-500 hover:text-sky-600 font-bold mb-4 transition-colors">
              <Icons.ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>
            
            {/* 1. FLEET TRACKER VIEW */}
            {adminActiveTab === 'fleetView' && (
              <FleetTracker employeeList={employeeList} />
            )}

            {/* 2. ADVANCED HR DIRECTORY VIEW */}
            {adminActiveTab === 'directory' && (
              <HRDirectory 
                employeeList={employeeList}
                createMessage={createMessage}
                handleCreateEmployee={handleCreateEmployee}
                newEmpName={newEmpName}
                setNewEmpName={setNewEmpName}
                newEmpEmail={newEmpEmail}
                setNewEmpEmail={setNewEmpEmail}
                newEmpPassword={newEmpPassword}
                setNewEmpPassword={setNewEmpPassword}
                isCreatingUser={isCreatingUser}
                expandedEmpId={expandedEmpId}
                setExpandedEmpId={setExpandedEmpId}
                user={user}
                handleToggleEmployeeStatus={handleToggleEmployeeStatus}
                handleDeleteEmployee={handleDeleteEmployee}
                handlePasswordReset={handlePasswordReset}
              />
            )}

            {/* 3. SCHEDULE MANAGER VIEW */}
            {adminActiveTab === 'scheduleManager' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><Icons.Calendar className="h-5 w-5 mr-2 text-sky-600" /> Dispatch Schedule Manager</h3>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Select Driver to Manage</label>
                  <select
                    className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-slate-50 font-bold"
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                  >
                    <option value="">-- Choose an Employee --</option>
                    {employeeList.filter(emp => emp.role !== 'admin').map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                    ))}
                  </select>
                </div>

                {selectedEmpId && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Assign New Shift</h3>
                      <form onSubmit={handleAddShift} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                          <input type="date" required value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Shift Time</label>
                          <input type="text" required placeholder="e.g., 8:00 AM - 4:00 PM or OFF" value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Unit</label>
                          <input type="text" required placeholder="e.g., Tow-402" value={shiftUnit} onChange={(e) => setShiftUnit(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg">
                          Save Shift
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100 bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-900">Driver's Calendar</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-600 text-sm">
                            <tr>
                              <th className="p-4 font-semibold">Date</th>
                              <th className="p-4 font-semibold">Time</th>
                              <th className="p-4 font-semibold">Unit</th>
                              <th className="p-4 font-semibold text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {empSchedule.map((shift) => (
                              <tr key={shift.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">{shift.date}</td>
                                <td className="p-4 text-slate-600">{shift.time}</td>
                                <td className="p-4 font-mono text-slate-500">{shift.unit}</td>
                                <td className="p-4 text-center">
                                  <button onClick={() => handleDeleteShift(shift.id)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded-md">
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {empSchedule.length === 0 && (
                              <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No shifts assigned to this driver yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. TIME OFF MANAGER VIEW */}
            {adminActiveTab === 'timeoffManager' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center"><Icons.Palmtree className="h-5 w-5 mr-2 text-sky-600" /> Time Off Approval Queue</h3>
                  <p className="text-gray-500 text-sm mb-6">Review driver vacation and sick leave requests. Approving will automatically deduct from their balances (8 hrs/day).</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 text-sm">
                        <tr>
                          <th className="p-4 font-semibold">Driver</th>
                          <th className="p-4 font-semibold">Dates</th>
                          <th className="p-4 font-semibold">Reason</th>
                          <th className="p-4 font-semibold">Pay Type</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allTimeOffRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-900">{req.userName}</td>
                            <td className="p-4 text-slate-600 font-medium">{req.startDate} to {req.endDate}</td>
                            <td className="p-4 text-slate-600">{req.reason}</td>
                            <td className="p-4">
                              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">{req.payType || 'Unspecified'}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                req.status === 'Denied' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                              {req.status === 'Pending Approval' && (
                                <>
                                  <button onClick={() => handleTimeOffAction(req.userId, req.id, 'Approved', req)} className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded transition-colors shadow-sm">
                                    Approve
                                  </button>
                                  <button onClick={() => handleTimeOffAction(req.userId, req.id, 'Denied', req)} className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded transition-colors shadow-sm">
                                    Deny
                                  </button>
                                </>
                              )}
                              {req.status !== 'Pending Approval' && (
                                <span className="text-xs text-gray-400 font-bold uppercase">Reviewed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {allTimeOffRequests.length === 0 && (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No time off requests found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. JOB BOARD MANAGER VIEW */}
            {adminActiveTab === 'jobManager' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center"><Icons.Briefcase className="h-5 w-5 mr-2 text-sky-600" /> Public Job Board Manager</h3>
                  <p className="text-gray-500 text-sm mb-6">Jobs posted here will instantly appear on the public Careers page.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
                      <h4 className="font-bold text-slate-800 mb-4">Post New Opening</h4>
                      <form onSubmit={handleAddJob} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                          <input required type="text" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. Tow Truck Operator" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Employment Type</label>
                          <select value={newJobType} onChange={(e) => setNewJobType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                          <input required type="text" value={newJobLoc} onChange={(e) => setNewJobLoc(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. Newark Area" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Pay Rate</label>
                          <input required type="text" value={newJobPay} onChange={(e) => setNewJobPay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="e.g. $25-35/hr" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Job Description</label>
                          <textarea required rows={3} value={newJobDesc} onChange={(e) => setNewJobDesc(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Briefly describe responsibilities..."></textarea>
                        </div>
                        <button type="submit" className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 transition-colors">
                          Post Job
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-600 text-sm">
                          <tr>
                            <th className="p-4 font-semibold">Job Title</th>
                            <th className="p-4 font-semibold">Type & Loc</th>
                            <th className="p-4 font-semibold">Pay Rate</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {adminJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50">
                              <td className="p-4 font-bold text-slate-900">{job.title}</td>
                              <td className="p-4 text-slate-600 text-sm">{job.type} • {job.loc}</td>
                              <td className="p-4 text-green-600 font-bold">{job.pay}</td>
                              <td className="p-4 text-right">
                                <button onClick={() => handleDeleteJob(job.id)} className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded transition-colors">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {adminJobs.length === 0 && (
                            <tr>
                              <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No jobs currently posted to the public site.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. ADMIN PROFILE VIEW */}
            {adminActiveTab === 'profile' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 border-b pb-4 flex items-center">
                  <Icons.User className="h-5 w-5 mr-2 text-sky-600"/> Admin Profile & Banking Info
                </h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl">
                  {profileStatus === 'saved' && <div className="bg-green-50 text-green-700 p-3 rounded-lg font-bold border border-green-200">Profile updated securely!</div>}
                  
                  <div className="space-y-4">
                    <h4 className="text-md font-bold text-slate-700 flex items-center"><Icons.MapPin className="h-4 w-4 mr-2 text-sky-600"/> Contact Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mailing Address</label>
                      <input type="text" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} placeholder="123 Main St, Apt 4B, City, State, ZIP" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="(555) 123-4567" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h4 className="text-md font-bold text-slate-700 flex items-center"><Icons.CreditCard className="h-4 w-4 mr-2 text-sky-600"/> Direct Deposit Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Routing Number</label>
                        <input type="password" value={profileRouting} onChange={(e) => setProfileRouting(e.target.value)} placeholder="•••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                        <input type="password" value={profileAccount} onChange={(e) => setProfileAccount(e.target.value)} placeholder="••••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium"><Icons.Shield className="h-3 w-3 inline mr-1" /> Banking information is encrypted and securely saved to Firebase.</p>
                  </div>

                  <button type="submit" disabled={profileStatus === 'saving'} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center">
                    <Icons.Save className="h-5 w-5 mr-2" /> {profileStatus === 'saving' ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}
            
            {/* 7. SERVICE PRICING MANAGER VIEW */}
            {adminActiveTab === 'serviceManager' && (
              <ServiceManager 
                adminServices={adminServices}
                newServiceLabel={newServiceLabel}
                setNewServiceLabel={setNewServiceLabel}
                newServicePrice={newServicePrice}
                setNewServicePrice={setNewServicePrice}
                newServiceIcon={newServiceIcon}
                setNewServiceIcon={setNewServiceIcon}
                handleAddService={handleAddService}
                handleEditServicePrice={handleEditServicePrice}
                handleDeleteService={handleDeleteService}
              />
            )}

            {/* 8. NEW QUICKBOOKS / PAYROLL ACCOUNTING VIEW */}
            {adminActiveTab === 'accounting' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-4xl mx-auto">
                <div className="text-center py-8">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.Download className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Payroll & Accounting Sync</h3>
                  <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                    Export your drivers' completed hours and accrued PTO instantly. This CSV file is pre-formatted and ready to be imported directly into QuickBooks Online or Gusto Payroll.
                  </p>
                  
                  <button 
                    onClick={handleExportQuickBooks}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all flex items-center mx-auto"
                  >
                    <Icons.Download className="h-6 w-6 mr-3" />
                    Download QuickBooks CSV
                  </button>

                  <div className="mt-8 text-left bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2 text-sm flex items-center">
                      <Icons.AlertTriangle className="h-4 w-4 mr-2 text-yellow-500"/> How to upload to QuickBooks
                    </h4>
                    <ol className="text-sm text-slate-600 list-decimal pl-5 space-y-1">
                      <li>Click the green download button above.</li>
                      <li>Log in to your QuickBooks Online account.</li>
                      <li>Go to <strong>Payroll</strong> {'>'} <strong>Employees</strong>.</li>
                      <li>Click the dropdown next to "Add an employee" and select <strong>Import from CSV</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- REGULAR EMPLOYEE VIEW ---
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* NEW: Shift Details Popup Modal */}
      {selectedShiftModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedShiftModal(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
             <h3 className="text-2xl font-black text-slate-900 mb-6 border-b pb-2">Shift Details</h3>
             <div className="space-y-4 text-slate-700">
               <p><strong className="text-slate-900 block text-xs uppercase tracking-wider mb-1">Date</strong> {selectedShiftModal.date}</p>
               <p><strong className="text-slate-900 block text-xs uppercase tracking-wider mb-1">Time</strong> {selectedShiftModal.time}</p>
               <p><strong className="text-slate-900 block text-xs uppercase tracking-wider mb-1">Assigned Unit</strong> <span className="font-mono bg-slate-100 px-2 py-1 rounded">{selectedShiftModal.unit}</span></p>
             </div>
             <button onClick={() => setSelectedShiftModal(null)} className="mt-8 w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg">Close Details</button>
          </div>
        </div>
      )}

      {/* Employee Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl mr-4">
            <Icons.User />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome, {userData?.name || 'Driver'}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
          <Icons.LogOut className="h-5 w-5 mr-2" /> Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
          <nav className="space-y-2">
            <button onClick={() => setEmpTab('dashboard')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'dashboard' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.Clock className="h-5 w-5 mr-3"/> Time Clock
            </button>
            <button onClick={() => setEmpTab('schedule')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'schedule' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.Calendar className="h-5 w-5 mr-3"/> My Schedule
            </button>
            <button onClick={() => setEmpTab('timeoff')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'timeoff' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.Palmtree className="h-5 w-5 mr-3"/> Request Time Off
            </button>
            <button onClick={() => setEmpTab('profile')} className={`w-full flex items-center p-3 rounded-lg font-bold transition-colors ${empTab === 'profile' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icons.User className="h-5 w-5 mr-3"/> My Profile
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          
          {/* TAB 1: TIME CLOCK & STATS */}
          {empTab === 'dashboard' && (
            <div>
              {/* Employee In-App Notifications Alert */}
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="bg-sky-50 border-l-4 border-sky-500 p-5 rounded-r-xl mb-8 shadow-sm">
                  <h4 className="font-bold text-sky-800 flex items-center mb-2"><Icons.AlertTriangle className="h-5 w-5 mr-2"/> New Notifications</h4>
                  <ul className="space-y-3">
                    {notifications.filter(n => !n.read).map(n => (
                       <li key={n.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-lg border border-sky-100 gap-3">
                         <span className="text-sm font-medium text-slate-700">{n.message}</span>
                         <button onClick={() => handleMarkNotificationRead(n.id)} className="text-xs bg-sky-100 text-sky-700 px-3 py-1.5 rounded-md font-bold hover:bg-sky-200 shrink-0">Mark as Read</button>
                       </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Shift Status</h3>
                  <p className="text-gray-500 mb-8">Record your exact hours to the database.</p>
                  
                  <div className={`p-6 rounded-2xl border-2 mb-8 ${userData?.workStatus === 'Clocked In' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</p>
                    <p className={`text-3xl font-black ${userData?.workStatus === 'Clocked In' ? 'text-green-600' : 'text-slate-700'}`}>
                      {userData?.workStatus || 'Clocked Out'}
                    </p>
                    {userData?.lastPunch && (
                      <p className="text-sm text-gray-500 mt-2">
                        Last punch: {new Date(userData.lastPunch).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'})}
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={handleClockToggle}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-transform hover:-translate-y-1 ${userData?.workStatus === 'Clocked In' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'}`}
                  >
                    {userData?.workStatus === 'Clocked In' ? 'CLOCK OUT' : 'CLOCK IN'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 h-full">
                    <h4 className="font-bold text-slate-700 mb-6 text-lg">Your Hours & Accruals</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center"><Icons.Clock className="h-6 w-6 text-sky-500 mr-3"/> <span className="font-bold text-slate-700">Total Hours</span></div>
                        <span className="text-2xl font-black text-slate-900">{userData?.hoursWorked || '0.00'} <span className="text-sm font-medium text-gray-500">hrs</span></span>
                      </div>
                      <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center"><Icons.Palmtree className="h-6 w-6 text-green-500 mr-3"/> <span className="font-bold text-slate-700">PTO Earned</span></div>
                        <span className="text-2xl font-black text-slate-900">{userData?.ptoEarned || '0.00'} <span className="text-sm font-medium text-gray-500">hrs</span></span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-6 text-center">Your exact clocked hours accurately accumulate here.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.5: SCHEDULE CALENDAR */}
          {empTab === 'schedule' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
                <h3 className="text-2xl font-bold text-slate-900">My Schedule</h3>
                
                <div className="flex items-center bg-sky-50 rounded-lg p-1">
                  <button onClick={handlePrevMonth} className="p-2 text-sky-700 hover:bg-sky-200 rounded-md transition-colors"><Icons.ChevronLeft className="h-5 w-5" /></button>
                  <span className="px-4 font-bold text-sky-900 min-w-[140px] text-center">{monthNames[calendarMonth]} {calendarYear}</span>
                  <button onClick={handleNextMonth} className="p-2 text-sky-700 hover:bg-sky-200 rounded-md transition-colors"><Icons.ChevronRight className="h-5 w-5" /></button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4 md:p-6">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-slate-400 text-xs sm:text-sm uppercase tracking-wider">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayObj, i) => {
                    if (!dayObj) return <div key={i} className="min-h-[80px] sm:min-h-[100px] p-2 bg-slate-50/50 rounded-lg border border-transparent"></div>;

                    const shift = mySchedule.find(s => s.date === dayObj.dateString);
                    let bgClass = "bg-white border-gray-100 hover:border-sky-300";
                    let content = null;

                    if (shift) {
                       const timeUpper = shift.time.toUpperCase();
                       bgClass += " cursor-pointer shadow-sm hover:shadow-md"; 
                       
                       if (timeUpper.includes('OFF') || timeUpper.includes('PTO') || timeUpper.includes('VACATION')) {
                           bgClass = "bg-gray-100 border-gray-200 cursor-pointer";
                           content = <div className="mt-1 px-1 py-1 bg-gray-200 text-gray-600 font-bold text-[10px] sm:text-xs rounded-md text-center">OFF DUTY</div>;
                       } else if (timeUpper.includes('SICK') || shift.unit.toUpperCase().includes('SICK')) {
                           bgClass = "bg-orange-50 border-orange-200 cursor-pointer";
                           content = <div className="mt-1 px-1 py-1 bg-orange-100 text-orange-700 font-bold text-[10px] sm:text-xs rounded-md text-center">SICK LEAVE</div>;
                       } else if (timeUpper.includes('HOLIDAY')) {
                           bgClass = "bg-purple-50 border-purple-200 cursor-pointer";
                           content = <div className="mt-1 px-1 py-1 bg-purple-100 text-purple-700 font-bold text-[10px] sm:text-xs rounded-md text-center">HOLIDAY</div>;
                       } else {
                           bgClass = "bg-sky-50 border-sky-200 cursor-pointer";
                           content = (
                             <div className="mt-1 flex flex-col gap-1 pointer-events-none">
                               <span className="px-1 sm:px-2 py-1 bg-sky-100 text-sky-800 font-bold text-[9px] sm:text-xs rounded-md text-center whitespace-nowrap truncate" title={shift.time}>{shift.time}</span>
                               <span className="px-1 sm:px-2 py-1 bg-white text-slate-500 font-mono font-bold text-[9px] sm:text-[10px] rounded-md text-center border border-sky-100 truncate" title={shift.unit}>{shift.unit}</span>
                             </div>
                           );
                       }
                    }

                    const today = new Date();
                    const isToday = dayObj.dateString === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                    return (
                      <div 
                        key={i} 
                        onClick={() => shift && setSelectedShiftModal(shift)}
                        className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg transition-all flex flex-col overflow-hidden ${bgClass} ${isToday ? 'ring-2 ring-sky-500 ring-offset-1' : ''}`}
                      >
                         <div className="flex justify-between items-center mb-1 pointer-events-none">
                            <span className={`text-xs sm:text-sm font-bold ${isToday ? 'text-white bg-sky-600 w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700'}`}>
                              {dayObj.day}
                            </span>
                         </div>
                         {content}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIME OFF */}
          {empTab === 'timeoff' && (
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Request Time Off</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-orange-100 text-orange-600 rounded-xl mr-4">
                    <Icons.Thermometer className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Sick Hours Available</p>
                    <p className="text-2xl font-black text-slate-900">{userData?.sickEarned || '24.00'} hrs</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-teal-100 text-teal-600 rounded-xl mr-4">
                    <Icons.Palmtree className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Vacation (PTO) Available</p>
                    <p className="text-2xl font-black text-slate-900">{userData?.ptoEarned || '0.00'} hrs</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <form onSubmit={handleTimeOffSubmit} className="space-y-4">
                  {timeOffStatus === 'success' && <div className="bg-green-50 text-green-700 p-3 rounded-lg font-bold border border-green-200">Request submitted to Admin!</div>}
                  {timeOffStatus === 'error' && <div className="bg-red-50 text-red-600 p-3 rounded-lg font-bold border border-red-200">Failed to submit.</div>}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                      <input type="date" required value={timeOffStart} onChange={(e) => setTimeOffStart(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                      <input type="date" required value={timeOffEnd} onChange={(e) => setTimeOffEnd(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Reason / Leave Type</label>
                    <select value={timeOffReason} onChange={(e) => setTimeOffReason(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                      <option value="Vacation">Vacation</option>
                      <option value="Personal Time Off">Personal Time Off</option>
                      <option value="Sick Time Off">Sick Time Off</option>
                      <option value="Bereavement">Bereavement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Pay Type</label>
                    <select value={timeOffPayType} onChange={(e) => setTimeOffPayType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white">
                      <option value="Use Earned PTO">Use Earned PTO</option>
                      <option value="Use Earned Sick Hours">Use Earned Sick Hours</option>
                      <option value="Unpaid">Unpaid Time Off</option>
                    </select>
                  </div>
                  <button type="submit" disabled={timeOffStatus === 'submitting'} className="bg-sky-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-700 w-full disabled:opacity-50 mt-2">
                    {timeOffStatus === 'submitting' ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>

                <div>
                  <h4 className="font-bold text-slate-700 mb-4">Your Recent Requests</h4>
                  <div className="space-y-3">
                    {timeOffHistory.map((req) => (
                      <div key={req.id} className="p-3 border border-gray-100 bg-slate-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-slate-800">{req.startDate} to {req.endDate}</p>
                          <p className="text-xs font-semibold text-sky-600">{req.reason} ({req.payType})</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          req.status === 'Denied' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                    {timeOffHistory.length === 0 && <p className="text-sm text-gray-500">No time off requested yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & BANKING */}
          {empTab === 'profile' && (
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Personal & Banking Info</h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl">
                {profileStatus === 'saved' && <div className="bg-green-50 text-green-700 p-3 rounded-lg font-bold border border-green-200">Profile updated securely!</div>}
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-700 flex items-center"><Icons.MapPin className="h-5 w-5 mr-2 text-sky-600"/> Contact Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mailing Address</label>
                    <input type="text" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} placeholder="123 Main St, Apt 4B, City, State, ZIP" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="(555) 123-4567" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                  </div>
                </div>

                {/* Banking Info */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-bold text-slate-700 flex items-center"><Icons.CreditCard className="h-5 w-5 mr-2 text-sky-600"/> Direct Deposit Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Routing Number</label>
                      <input type="password" value={profileRouting} onChange={(e) => setProfileRouting(e.target.value)} placeholder="•••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                      <input type="password" value={profileAccount} onChange={(e) => setProfileAccount(e.target.value)} placeholder="••••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium"><Icons.Shield className="h-3 w-3 inline mr-1" /> Banking information is encrypted and securely saved to Firebase.</p>
                </div>

                <button type="submit" disabled={profileStatus === 'saving'} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center">
                  <Icons.Save className="h-5 w-5 mr-2" /> {profileStatus === 'saving' ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- TERMS AND POLICIES PAGE ---

export default EmployeePortal;

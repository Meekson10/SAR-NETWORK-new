import re

with open("src/pages/EmployeePortal.jsx", "r") as f:
    code = f.read()

# Add imports
imports_to_add = """
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
"""

# 1. Update imports
code = code.replace("import { signInWithEmailAndPassword", "import { query, limit, orderBy } from 'firebase/firestore';\nimport { signInWithEmailAndPassword")
code = code.replace("const WEB3FORMS_KEY =", imports_to_add + "\nconst WEB3FORMS_KEY =")

# 2. Add limits to getDocs
code = code.replace('getDocs(collection(db, "users"))', 'getDocs(query(collection(db, "users"), limit(20)))')
code = code.replace('getDocs(collection(db, "users", uid, "schedules"))', 'getDocs(query(collection(db, "users", uid, "schedules"), limit(20)))')
code = code.replace('getDocs(collection(db, "users", user.uid, "time_off"))', 'getDocs(query(collection(db, "users", user.uid, "time_off"), limit(20)))')
code = code.replace('getDocs(collection(db, "users", user.uid, "schedules"))', 'getDocs(query(collection(db, "users", user.uid, "schedules"), limit(20)))')

# 3. Replace alert and confirm
code = code.replace('alert("Job posted successfully!");', 'toast.success("Job posted successfully!");')
code = code.replace('alert("Failed to post job.");', 'toast.error("Failed to post job.");')
code = code.replace('!confirm("Are you sure you want to permanently delete this job posting?")', '!(await customConfirm("Are you sure you want to permanently delete this job posting?"))')
code = code.replace('alert("Failed to delete job.");', 'toast.error("Failed to delete job.");')

code = code.replace('alert("No employees to export.");', 'toast.error("No employees to export.");')
code = code.replace('alert("Failed to clock in/out. Check connection.");', 'toast.error("Failed to clock in/out. Check connection.");')

code = code.replace('alert("Service added successfully.");', 'toast.success("Service added successfully.");')
code = code.replace('alert("Error adding service");', 'toast.error("Error adding service");')
code = code.replace('!confirm("Delete this service? This will permanently remove it from the customer request page.")', '!(await customConfirm("Delete this service? This will permanently remove it from the customer request page."))')
code = code.replace('alert("Error deleting service");', 'toast.error("Error deleting service");')
code = code.replace('alert("Error updating price");', 'toast.error("Error updating price");')

code = code.replace('alert("Failed to update employee status.");', 'toast.error("Failed to update employee status.");')

# The employee delete confirm uses prompt, we can't easily replace prompt with toast, but we can replace the alerts:
code = code.replace('alert("Account deletion cancelled.");', 'toast.error("Account deletion cancelled.");')
code = code.replace('alert(`${empName || \'Employee\'} has been successfully deleted.`);', 'toast.success(`${empName || \'Employee\'} has been successfully deleted.`);')
code = code.replace('alert("Failed to delete employee.");', 'toast.error("Failed to delete employee.");')

code = code.replace('!confirm(`Are you sure you want to send a password reset email to ${empEmail}?`)', '!(await customConfirm(`Are you sure you want to send a password reset email to ${empEmail}?`))')
code = code.replace('alert("Password reset email sent successfully! The driver can use the link in their email to set a new password.");', 'toast.success("Password reset email sent successfully! The driver can use the link in their email to set a new password.");')
code = code.replace('alert("Failed to send password reset email. Ensure the email address is correct.");', 'toast.error("Failed to send password reset email. Ensure the email address is correct.");')

code = code.replace('alert("Failed to assign shift.");', 'toast.error("Failed to assign shift.");')
code = code.replace('!confirm("Remove this shift?")', '!(await customConfirm("Remove this shift?"))')
code = code.replace('alert("Failed to remove shift.");', 'toast.error("Failed to remove shift.");')

code = code.replace('alert(`Request has been successfully ${newStatus.toUpperCase()} and the employee has been notified.`);', 'toast.success(`Request has been successfully ${newStatus.toUpperCase()} and the employee has been notified.`);')
code = code.replace('alert("Failed to update request status: " + error.message);', 'toast.error("Failed to update request status: " + error.message);')

code = code.replace('alert("This account has been deactivated by an Administrator.");', 'toast.error("This account has been deactivated by an Administrator.");')

# 4. Replace Admin Dashboard View block
dashboard_regex = re.compile(r"\{adminActiveTab === 'dashboard' \? \([\s\S]*?\) : \(")
dashboard_replacement = """{adminActiveTab === 'dashboard' ? (
          <AdminDashboardView 
            allTimeOffRequests={allTimeOffRequests}
            employeeList={employeeList}
            adminJobs={adminJobs}
            adminServices={adminServices}
            setAdminActiveTab={setAdminActiveTab}
          />
        ) : ("""
code = dashboard_regex.sub(dashboard_replacement, code)

# 5. Replace FleetTracker block
fleet_regex = re.compile(r"\{\/\* 1\. FLEET TRACKER VIEW \*\/\}[\s\S]*?\{\/\* 2\. ADVANCED HR DIRECTORY VIEW \*\/\}")
fleet_replacement = """{/* 1. FLEET TRACKER VIEW */}
            {adminActiveTab === 'fleetView' && (
              <FleetTracker employeeList={employeeList} />
            )}

            {/* 2. ADVANCED HR DIRECTORY VIEW */}"""
code = fleet_regex.sub(fleet_replacement, code)

# 6. Replace HRDirectory block
hr_regex = re.compile(r"\{\/\* 2\. ADVANCED HR DIRECTORY VIEW \*\/\}[\s\S]*?\{\/\* 3\. SCHEDULE MANAGER VIEW \*\/\}")
hr_replacement = """{/* 2. ADVANCED HR DIRECTORY VIEW */}
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

            {/* 3. SCHEDULE MANAGER VIEW */}"""
code = hr_regex.sub(hr_replacement, code)

# 7. Replace ScheduleManager block
schedule_regex = re.compile(r"\{\/\* 3\. SCHEDULE MANAGER VIEW \*\/\}[\s\S]*?\{\/\* 4\. JOB POSTING MANAGER VIEW \*\/\}")
schedule_replacement = """{/* 3. SCHEDULE MANAGER VIEW */}
            {adminActiveTab === 'scheduleManager' && (
              <ScheduleManager 
                employeeList={employeeList}
                selectedEmpId={selectedEmpId}
                setSelectedEmpId={setSelectedEmpId}
                shiftDate={shiftDate}
                setShiftDate={setShiftDate}
                shiftTime={shiftTime}
                setShiftTime={setShiftTime}
                shiftUnit={shiftUnit}
                setShiftUnit={setShiftUnit}
                handleAddShift={handleAddShift}
                empSchedule={empSchedule}
                handleDeleteShift={handleDeleteShift}
              />
            )}

            {/* 4. JOB POSTING MANAGER VIEW */}"""
code = schedule_regex.sub(schedule_replacement, code)

# 8. Replace JobManager block
job_regex = re.compile(r"\{\/\* 4\. JOB POSTING MANAGER VIEW \*\/\}[\s\S]*?\{\/\* 5\. TIME OFF MANAGER VIEW \*\/\}")
job_replacement = """{/* 4. JOB POSTING MANAGER VIEW */}
            {adminActiveTab === 'jobManager' && (
              <JobManager 
                adminJobs={adminJobs}
                newJobTitle={newJobTitle}
                setNewJobTitle={setNewJobTitle}
                newJobType={newJobType}
                setNewJobType={setNewJobType}
                newJobLoc={newJobLoc}
                setNewJobLoc={setNewJobLoc}
                newJobPay={newJobPay}
                setNewJobPay={setNewJobPay}
                newJobDesc={newJobDesc}
                setNewJobDesc={setNewJobDesc}
                handleAddJob={handleAddJob}
                handleDeleteJob={handleDeleteJob}
              />
            )}

            {/* 5. TIME OFF MANAGER VIEW */}"""
code = job_regex.sub(job_replacement, code)

# 9. Replace TimeOffManager block
timeoff_regex = re.compile(r"\{\/\* 5\. TIME OFF MANAGER VIEW \*\/\}[\s\S]*?\{\/\* 7\. SERVICE PRICING MANAGER VIEW \*\/\}")
timeoff_replacement = """{/* 5. TIME OFF MANAGER VIEW */}
            {adminActiveTab === 'timeoffManager' && (
              <TimeOffManager 
                allTimeOffRequests={allTimeOffRequests}
                handleTimeOffAction={handleTimeOffAction}
              />
            )}

            {/* 7. SERVICE PRICING MANAGER VIEW */}"""
code = timeoff_regex.sub(timeoff_replacement, code)

# 10. Replace ServiceManager block
service_regex = re.compile(r"\{\/\* 7\. SERVICE PRICING MANAGER VIEW \*\/\}[\s\S]*?\{\/\* 8\. NEW QUICKBOOKS \/ PAYROLL ACCOUNTING VIEW \*\/\}")
service_replacement = """{/* 7. SERVICE PRICING MANAGER VIEW */}
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

            {/* 8. NEW QUICKBOOKS / PAYROLL ACCOUNTING VIEW */}"""
code = service_regex.sub(service_replacement, code)

# 11. Replace EmployeeProfile block (under TAB 3: PROFILE & BANKING)
profile_regex = re.compile(r"\{\/\* TAB 3: PROFILE & BANKING \*\/\}[\s\S]*?\{\/\* --- TERMS AND POLICIES PAGE --- \*\/\}")
profile_replacement = """{/* TAB 3: PROFILE & BANKING */}
          {empTab === 'profile' && (
            <EmployeeProfile 
              profileStatus={profileStatus}
              handleUpdateProfile={handleUpdateProfile}
              profileAddress={profileAddress}
              setProfileAddress={setProfileAddress}
              profilePhone={profilePhone}
              setProfilePhone={setProfilePhone}
              profileRouting={profileRouting}
              setProfileRouting={setProfileRouting}
              profileAccount={profileAccount}
              setProfileAccount={setProfileAccount}
            />
          )}

        </div>
      </div>
    </div>
  );
};

// --- TERMS AND POLICIES PAGE ---"""
code = profile_regex.sub(profile_replacement, code)

with open("src/pages/EmployeePortal.jsx", "w") as f:
    f.write(code)


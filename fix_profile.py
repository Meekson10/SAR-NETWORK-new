import re

with open("src/pages/EmployeePortal.jsx", "r") as f:
    code = f.read()

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
              userData={userData}
              user={user}
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


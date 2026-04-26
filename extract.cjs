const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'App.jsx');
const content = fs.readFileSync(srcPath, 'utf-8');

const getComponentContent = (startStr, endStr) => {
  const startIdx = content.indexOf(startStr);
  if (startIdx === -1) return '';
  const endIdx = endStr ? content.indexOf(endStr, startIdx) : content.length;
  if (endIdx === -1) return content.slice(startIdx);
  return content.slice(startIdx, endIdx);
};

const components = {
  Navigation: getComponentContent('const Navigation =', 'const HomePage ='),
  HomePage: getComponentContent('const HomePage =', 'const AboutPage ='),
  AboutPage: getComponentContent('const AboutPage =', 'const ServiceRequestPage ='),
  ServiceRequestPage: getComponentContent('const ServiceRequestPage =', 'const CareersPage ='),
  CareersPage: getComponentContent('const CareersPage =', 'const ContactPage ='),
  ContactPage: getComponentContent('const ContactPage =', 'const EmployeePortal ='),
  EmployeePortal: getComponentContent('const EmployeePortal =', 'const TermsPage ='),
  TermsPage: getComponentContent('const TermsPage =', 'const PrivacyPage ='),
  PrivacyPage: getComponentContent('const PrivacyPage =', 'const Footer ='),
  Footer: getComponentContent('const Footer =', 'const App =')
};

const createPageFile = (name, compContent) => {
  // basic imports
  const imports = `import React, { useState, useEffect } from 'react';\nimport { Link } from 'react-router-dom';\nimport { Icons, SarLogo } from '../components/Icons';\nimport { db, auth, secondaryAuth, secondaryApp } from '../services/firebase';\nimport { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';\nimport { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';\n\nconst WEB3FORMS_KEY = "2f182922-a7f9-483f-afd0-73d11139bbe3";\nconst CHASE_PAYMENT_LINK = "https://checkout.chase.com/placeholder";\n\n`;
  
  // replace setActivePage with Link later or just export it for now
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', `${name}.jsx`), imports + compContent + `\nexport default ${name};\n`);
};

Object.entries(components).forEach(([name, compContent]) => {
  if (name === 'Navigation' || name === 'Footer') {
    const imports = `import React from 'react';\nimport { Link } from 'react-router-dom';\nimport { Icons, SarLogo } from './Icons';\n\n`;
    fs.writeFileSync(path.join(__dirname, 'src', 'components', `${name}.jsx`), imports + compContent + `\nexport default ${name};\n`);
  } else {
    createPageFile(name, compContent);
  }
});

console.log('Extraction complete!');

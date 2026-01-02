/**
 * Create Role-Based Users Script
 * Creates admin, events manager, and finance manager users
 * 
 * Usage: node src/scripts/createRoleUsers.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Users to create
const users = [
  {
    email: 'admin@christag.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
  },
  {
    email: 'events@christag.com',
    password: 'events123',
    name: 'Events Manager',
    role: 'events_manager',
  },
  {
    email: 'finance@christag.com',
    password: 'finance123',
    name: 'Finance Manager',
    role: 'finance_manager',
  },
  {
    email: 'resource@christag.com',
    password: 'resource123',
    name: 'Resource Manager',
    role: 'resource_manager',
  },
];

async function createUser(userData) {
  try {
    console.log(`\nCreating user: ${userData.email}...`);
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const uid = userCredential.user.uid;
    
    // Create user document with UID as document ID
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log(`✓ User created successfully`);
    console.log(`  Email: ${userData.email}`);
    console.log(`  Password: ${userData.password}`);
    console.log(`  Role: ${userData.role}`);
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`ℹ User already exists: ${userData.email}`);
    } else {
      console.error(`✗ Error creating user ${userData.email}:`, error.message);
    }
  }
}

async function createAllUsers() {
  console.log('=================================');
  console.log('Creating Role-Based Users');
  console.log('=================================');

  for (const userData of users) {
    await createUser(userData);
  }

  console.log('\n=================================');
  console.log('User Creation Completed!');
  console.log('=================================\n');
  
  console.log('Login Credentials:\n');
  console.log('1. ADMIN (Full Access):');
  console.log('   Email: admin@christag.com');
  console.log('   Password: admin123\n');
  
  console.log('2. EVENTS MANAGER (Events & Notifications):');
  console.log('   Email: events@christag.com');
  console.log('   Password: events123\n');
  
  console.log('3. FINANCE MANAGER (Donations & Finances):');
  console.log('   Email: finance@christag.com');
  console.log('   Password: finance123\n');

  console.log('4. RESOURCE MANAGER (Articles & Resources):');
  console.log('   Email: resource@christag.com');
  console.log('   Password: resource123\n');

  process.exit(0);
}

createAllUsers().catch(error => {
  console.error('\n✗ Script failed:', error);
  process.exit(1);
});

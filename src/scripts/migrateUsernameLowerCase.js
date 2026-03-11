/**
 * Migration Script: Add usernameLowerCase field to existing member credentials
 * Run this once to update all existing members with portal access
 */

const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const MEMBERS_COLLECTION = 'members';

async function migrateUsernameLowerCase() {
  try {
    console.log('Starting migration: Adding usernameLowerCase field to member credentials...');
    
    const membersSnapshot = await db.collection(MEMBERS_COLLECTION)
      .where('hasPortalAccess', '==', true)
      .get();
    
    if (membersSnapshot.empty) {
      console.log('No members with portal access found.');
      return;
    }
    
    console.log(`Found ${membersSnapshot.size} members with portal access`);
    
    const batch = db.batch();
    let updateCount = 0;
    
    for (const doc of membersSnapshot.docs) {
      const data = doc.data();
      
      // Check if credentials exist and usernameLowerCase is missing
      if (data.credentials && data.credentials.username && !data.credentials.usernameLowerCase) {
        const memberRef = db.collection(MEMBERS_COLLECTION).doc(doc.id);
        
        batch.update(memberRef, {
          'credentials.usernameLowerCase': data.credentials.username.toLowerCase(),
          'updatedAt': admin.firestore.FieldValue.serverTimestamp()
        });
        
        updateCount++;
        console.log(`Queued update for member: ${doc.id} (${data.name}) - Username: ${data.credentials.username}`);
      }
    }
    
    if (updateCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updateCount} member(s) with usernameLowerCase field`);
    } else {
      console.log('No members needed updating - all already have usernameLowerCase field');
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateUsernameLowerCase();

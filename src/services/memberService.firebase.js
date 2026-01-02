/**
 * Member Service - Firebase Integration
 * Handles Firebase Firestore operations for member management
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const MEMBERS_COLLECTION = 'members';

/**
 * Generate a secure random password
 */
const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

/**
 * Generate credentials for a member
 */
const generateCredentials = (member) => {
  const username = member.email.split('@')[0] + (member.id || '');
  const password = generatePassword();
  return {
    username,
    password,
    temporaryPassword: true,
    lastPasswordChange: null,
  };
};

/**
 * Send credentials email (mock implementation)
 */
const sendCredentialsEmail = async (member, credentials) => {
  // Simulate email sending
  console.log(`Email sent to ${member.email}`);
  console.log(`Username: ${credentials.username}`);
  console.log(`Temporary Password: ${credentials.password}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

/**
 * Get all members from Firebase
 */
const getMembers = async () => {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const membersSnapshot = await getDocs(membersCol);
    const membersList = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to ISO strings
      dateOfBirth: doc.data().dateOfBirth?.toDate?.()?.toISOString() || doc.data().dateOfBirth,
      joinDate: doc.data().joinDate?.toDate?.()?.toISOString() || doc.data().joinDate,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));
    return membersList;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

/**
 * Get a single member by ID
 */
const getMemberById = async (id) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, id);
    const memberSnapshot = await getDoc(memberDoc);
    
    if (memberSnapshot.exists()) {
      const data = memberSnapshot.data();
      return {
        id: memberSnapshot.id,
        ...data,
        dateOfBirth: data.dateOfBirth?.toDate?.()?.toISOString() || data.dateOfBirth,
        joinDate: data.joinDate?.toDate?.()?.toISOString() || data.joinDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
};

/**
 * Get member by credentials (for portal login)
 */
const getMemberByCredentials = async (username, password) => {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const q = query(
      membersCol,
      where('credentials.username', '==', username),
      where('hasPortalAccess', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      // Verify password
      if (data.credentials?.password === password) {
        return {
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate?.()?.toISOString() || data.dateOfBirth,
          joinDate: data.joinDate?.toDate?.()?.toISOString() || data.joinDate,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error authenticating member:', error);
    throw error;
  }
};

/**
 * Create a new member
 */
const createMember = async (memberData) => {
  try {
    const newMember = {
      ...memberData,
      status: memberData.status || 'active',
      hasPortalAccess: false,
      credentials: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), newMember);
    
    return {
      id: docRef.id,
      ...newMember,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

/**
 * Update an existing member
 */
const updateMember = async (id, memberData) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, id);
    
    const updateData = {
      ...memberData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(memberDoc, updateData);
    
    // Fetch and return updated member
    return await getMemberById(id);
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

/**
 * Delete a member
 */
const deleteMember = async (id) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, id);
    await deleteDoc(memberDoc);
    return true;
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

/**
 * Generate and save member portal credentials
 */
const generateMemberCredentials = async (memberId) => {
  try {
    const member = await getMemberById(memberId);
    
    if (!member) {
      throw new Error('Member not found');
    }
    
    if (member.hasPortalAccess && member.credentials) {
      throw new Error('Member already has portal access');
    }
    
    const credentials = generateCredentials(member);
    
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    await updateDoc(memberDoc, {
      hasPortalAccess: true,
      credentials: credentials,
      updatedAt: serverTimestamp(),
    });
    
    await sendCredentialsEmail(member, credentials);
    
    return {
      ...member,
      hasPortalAccess: true,
      credentials: credentials,
    };
  } catch (error) {
    console.error('Error generating credentials:', error);
    throw error;
  }
};

/**
 * Reset member portal password
 */
const resetMemberCredentials = async (memberId) => {
  try {
    const member = await getMemberById(memberId);
    
    if (!member) {
      throw new Error('Member not found');
    }
    
    if (!member.hasPortalAccess || !member.credentials) {
      throw new Error('Member does not have portal access');
    }
    
    const newPassword = generatePassword();
    
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    await updateDoc(memberDoc, {
      'credentials.password': newPassword,
      'credentials.temporaryPassword': true,
      'credentials.lastPasswordChange': serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const updatedCredentials = {
      ...member.credentials,
      password: newPassword,
      temporaryPassword: true,
    };
    
    await sendCredentialsEmail(member, updatedCredentials);
    
    return {
      ...member,
      credentials: updatedCredentials,
    };
  } catch (error) {
    console.error('Error resetting credentials:', error);
    throw error;
  }
};

/**
 * Revoke member portal access
 */
const revokeMemberAccess = async (memberId) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    
    await updateDoc(memberDoc, {
      hasPortalAccess: false,
      credentials: null,
      updatedAt: serverTimestamp(),
    });
    
    const member = await getMemberById(memberId);
    return member;
  } catch (error) {
    console.error('Error revoking access:', error);
    throw error;
  }
};

/**
 * Search members by name or email
 */
const searchMembers = async (searchTerm) => {
  try {
    const members = await getMembers();
    
    if (!searchTerm) return members;
    
    const term = searchTerm.toLowerCase();
    return members.filter(member =>
      member.name.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error searching members:', error);
    throw error;
  }
};

/**
 * Get member statistics
 */
const getMemberStats = async () => {
  try {
    const members = await getMembers();
    
    return {
      total: members.length,
      active: members.filter(m => m.status === 'active').length,
      inactive: members.filter(m => m.status === 'inactive').length,
      withPortalAccess: members.filter(m => m.hasPortalAccess).length,
    };
  } catch (error) {
    console.error('Error fetching member stats:', error);
    throw error;
  }
};

// Named exports for direct function imports
export const getAllMembers = getMembers;
export const getMember = getMemberById;
export { 
  getMembers,
  getMemberById,
  getMemberByCredentials,
  createMember,
  updateMember,
  deleteMember,
  generateMemberCredentials,
  resetMemberCredentials,
  revokeMemberAccess,
  searchMembers,
  getMemberStats,
};

// Default export
const memberService = {
  getMembers,
  getMemberById,
  getMemberByCredentials,
  createMember,
  updateMember,
  deleteMember,
  generateMemberCredentials,
  resetMemberCredentials,
  revokeMemberAccess,
  searchMembers,
  getMemberStats,
};

export default memberService;

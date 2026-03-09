/**
 * Bible Reading Service - Firebase Integration
 * Handles Firebase Firestore operations for Bible reading progress
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

const BIBLE_READING_COLLECTION = 'bibleReadingProgress';

/**
 * Get or create user's Bible reading progress
 * @param {string} userId - User's unique identifier (generated from browser)
 */
export const getUserProgress = async (userId) => {
  try {
    const userDocRef = doc(db, BIBLE_READING_COLLECTION, userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      return {
        id: userDocSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

/**
 * Create a new user progress record
 * @param {string} userId - User's unique identifier
 * @param {string} userName - User's display name
 * @param {number} startDay - Starting day number (1-365)
 */
export const createUserProgress = async (userId, userName, startDay = 1) => {
  try {
    const userDocRef = doc(db, BIBLE_READING_COLLECTION, userId);
    
    const progressData = {
      userId,
      userName,
      startDay,
      startDate: serverTimestamp(),
      completedDays: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(userDocRef, progressData);
    
    return {
      id: userId,
      ...progressData,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating user progress:', error);
    throw error;
  }
};

/**
 * Update user's Bible reading progress
 * @param {string} userId - User's unique identifier
 * @param {number[]} completedDays - Array of completed day numbers
 */
export const updateUserProgress = async (userId, completedDays) => {
  try {
    const userDocRef = doc(db, BIBLE_READING_COLLECTION, userId);
    
    await updateDoc(userDocRef, {
      completedDays,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

/**
 * Update user's name
 * @param {string} userId - User's unique identifier
 * @param {string} userName - New user name
 */
export const updateUserName = async (userId, userName) => {
  try {
    const userDocRef = doc(db, BIBLE_READING_COLLECTION, userId);
    
    await updateDoc(userDocRef, {
      userName,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
};

/**
 * Get all users' Bible reading progress (Admin only)
 */
export const getAllUsersProgress = async () => {
  try {
    const progressCol = collection(db, BIBLE_READING_COLLECTION);
    
    try {
      const progressQuery = query(progressCol, orderBy('createdAt', 'desc'));
      const progressSnapshot = await getDocs(progressQuery);
      
      const progressList = progressSnapshot.docs.map(doc => {
        const data = doc.data();
        const completedCount = data.completedDays?.length || 0;
        const totalDays = 365;
        const progressPercent = ((completedCount / totalDays) * 100).toFixed(1);
        
        return {
          id: doc.id,
          ...data,
          completedCount,
          progressPercent,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
        };
      });
      
      return progressList;
    } catch (orderByError) {
      console.warn('OrderBy failed, fetching without sort:', orderByError.message);
      const progressSnapshot = await getDocs(progressCol);
      
      const progressList = progressSnapshot.docs.map(doc => {
        const data = doc.data();
        const completedCount = data.completedDays?.length || 0;
        const totalDays = 365;
        const progressPercent = ((completedCount / totalDays) * 100).toFixed(1);
        
        return {
          id: doc.id,
          ...data,
          completedCount,
          progressPercent,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
        };
      });
      
      return progressList;
    }
  } catch (error) {
    console.error('Error fetching all users progress:', error);
    throw error;
  }
};

/**
 * Generate a unique user ID based on browser fingerprint
 * This creates a semi-persistent ID without requiring authentication
 */
export const generateUserId = () => {
  // Check if user already has an ID in localStorage
  let userId = localStorage.getItem('bibleReadingUserId');
  
  if (!userId) {
    // Generate a new unique ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('bibleReadingUserId', userId);
  }
  
  return userId;
};

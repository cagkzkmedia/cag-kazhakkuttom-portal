/**
 * Announcement Service - Firebase
 * Manages announcements with expiry dates
 */

import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'announcements';

/**
 * Get all announcements (for admin)
 */
export const getAllAnnouncements = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      expiryDate: doc.data().expiryDate?.toDate?.().toISOString() || null,
    }));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

/**
 * Get active announcements (not expired)
 */
export const getActiveAnnouncements = async () => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, COLLECTION_NAME),
      where('expiryDate', '>', now),
      orderBy('expiryDate', 'asc'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      expiryDate: doc.data().expiryDate?.toDate?.().toISOString() || null,
    }));
  } catch (error) {
    console.error('Error fetching active announcements:', error);
    // Fallback: get all and filter client-side
    try {
      const allDocs = await getDocs(collection(db, COLLECTION_NAME));
      const now = new Date();
      return allDocs.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
          expiryDate: doc.data().expiryDate?.toDate?.().toISOString() || null,
        }))
        .filter(announcement => {
          const expiryDate = new Date(announcement.expiryDate);
          return expiryDate > now;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * Get announcement by ID
 */
export const getAnnouncementById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Announcement not found');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      expiryDate: docSnap.data().expiryDate?.toDate?.().toISOString() || null,
    };
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw error;
  }
};

/**
 * Create new announcement
 */
export const createAnnouncement = async (announcementData) => {
  try {
    const { title, description, imageBase64, expiryDate } = announcementData;
    
    if (!title || !description || !expiryDate) {
      throw new Error('Title, description, and expiry date are required');
    }

    const newAnnouncement = {
      title: title.trim(),
      description: description.trim(),
      imageBase64: imageBase64 || null,
      expiryDate: Timestamp.fromDate(new Date(expiryDate)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newAnnouncement);
    
    return {
      id: docRef.id,
      ...newAnnouncement,
      createdAt: newAnnouncement.createdAt.toDate().toISOString(),
      expiryDate: newAnnouncement.expiryDate.toDate().toISOString(),
    };
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

/**
 * Update announcement
 */
export const updateAnnouncement = async (id, announcementData) => {
  try {
    const { title, description, imageBase64, expiryDate } = announcementData;
    
    const updateData = {
      updatedAt: Timestamp.now(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (imageBase64 !== undefined) updateData.imageBase64 = imageBase64;
    if (expiryDate !== undefined) {
      updateData.expiryDate = Timestamp.fromDate(new Date(expiryDate));
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updateData);
    
    return await getAnnouncementById(id);
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true, id };
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

/**
 * Delete expired announcements (cleanup)
 */
export const deleteExpiredAnnouncements = async () => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, COLLECTION_NAME),
      where('expiryDate', '<', now)
    );
    const snapshot = await getDocs(q);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return { success: true, count: snapshot.docs.length };
  } catch (error) {
    console.error('Error deleting expired announcements:', error);
    throw error;
  }
};

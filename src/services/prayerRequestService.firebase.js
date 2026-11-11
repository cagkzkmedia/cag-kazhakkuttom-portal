/**
 * Prayer Request Service - Firebase
 * Manages prayer requests submitted by website visitors
 */

import { db } from '../config/firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

const COLLECTION_NAME = 'prayerRequests';

const normalizePrayerRequest = (docSnapshot) => {
  const data = docSnapshot.data() || {};

  return {
    id: docSnapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    readAt: data.readAt?.toDate ? data.readAt.toDate().toISOString() : data.readAt || null,
  };
};

export const createPrayerRequest = async (requestData) => {
  try {
    const { name, address, phone, prayerRequest } = requestData;

    if (!name?.trim()) {
      throw new Error('Name is required');
    }

    if (!prayerRequest?.trim()) {
      throw new Error('Prayer request is required');
    }

    const payload = {
      name: name.trim(),
      address: address?.trim() || '',
      phone: phone?.trim() || '',
      prayerRequest: prayerRequest.trim(),
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      readAt: null,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);

    return {
      id: docRef.id,
      ...payload,
      createdAt: new Date().toISOString(),
      readAt: null,
      read: false,
    };
  } catch (error) {
    console.error('Error creating prayer request:', error);
    throw error;
  }
};

export const getAllPrayerRequests = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(normalizePrayerRequest);
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    throw error;
  }
};

export const getUnreadPrayerRequests = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(normalizePrayerRequest);
  } catch (error) {
    console.error('Error fetching unread prayer requests:', error);
    throw error;
  }
};

export const markPrayerRequestAsRead = async (requestId) => {
  try {
    const requestRef = doc(db, COLLECTION_NAME, requestId);
    await updateDoc(requestRef, {
      read: true,
      readAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error marking prayer request as read:', error);
    throw error;
  }
};

export const getPrayerRequestCount = async () => {
  try {
    const unread = await getUnreadPrayerRequests();
    return unread.length;
  } catch (error) {
    console.error('Error fetching prayer request count:', error);
    return 0;
  }
};

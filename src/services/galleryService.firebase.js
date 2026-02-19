import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'gallery';

// Create new gallery photo
export const createGalleryPhoto = async (photoData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...photoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...photoData };
  } catch (error) {
    console.error('Error creating gallery photo:', error);
    throw error;
  }
};

// Get all gallery photos
export const getAllGalleryPhotos = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    throw error;
  }
};

// Update gallery photo
export const updateGalleryPhoto = async (id, photoData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...photoData,
      updatedAt: serverTimestamp()
    });
    return { id, ...photoData };
  } catch (error) {
    console.error('Error updating gallery photo:', error);
    throw error;
  }
};

// Delete gallery photo
export const deleteGalleryPhoto = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    throw error;
  }
};

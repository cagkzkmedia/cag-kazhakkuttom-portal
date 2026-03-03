/**
 * Author Service - Firebase Implementation
 * Handles author data with name and photo
 */

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const AUTHORS_COLLECTION = 'authors';

/**
 * Get all authors
 * @returns {Promise<Array>} - Array of author objects
 */
export const getAllAuthors = async () => {
  try {
    const authorsRef = collection(db, AUTHORS_COLLECTION);
    const q = query(authorsRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
};

/**
 * Get author by ID
 * @param {string} id - Author ID
 * @returns {Promise<Object|null>} - Author object or null
 */
export const getAuthorById = async (id) => {
  try {
    const authorRef = doc(db, AUTHORS_COLLECTION, id);
    const authorDoc = await getDoc(authorRef);
    
    if (authorDoc.exists()) {
      return {
        id: authorDoc.id,
        ...authorDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching author:', error);
    throw error;
  }
};

/**
 * Get author by name (case-insensitive)
 * @param {string} name - Author name
 * @returns {Promise<Object|null>} - Author object or null
 */
export const getAuthorByName = async (name) => {
  try {
    const authorsRef = collection(db, AUTHORS_COLLECTION);
    const q = query(authorsRef, where('name', '==', name));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching author by name:', error);
    throw error;
  }
};

/**
 * Create a new author
 * @param {Object} authorData - Author data
 * @param {string} authorData.name - Author name
 * @param {string} authorData.photo - Author photo (base64)
 * @returns {Promise<string>} - Created author ID
 */
export const createAuthor = async (authorData) => {
  try {
    // Check if author already exists
    const existingAuthor = await getAuthorByName(authorData.name);
    if (existingAuthor) {
      return existingAuthor.id;
    }

    const authorsRef = collection(db, AUTHORS_COLLECTION);
    const docRef = await addDoc(authorsRef, {
      name: authorData.name,
      photo: authorData.photo || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating author:', error);
    throw error;
  }
};

/**
 * Update an author
 * @param {string} id - Author ID
 * @param {Object} authorData - Author data to update
 * @returns {Promise<void>}
 */
export const updateAuthor = async (id, authorData) => {
  try {
    const authorRef = doc(db, AUTHORS_COLLECTION, id);
    await updateDoc(authorRef, {
      ...authorData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating author:', error);
    throw error;
  }
};

/**
 * Delete an author
 * @param {string} id - Author ID
 * @returns {Promise<void>}
 */
export const deleteAuthor = async (id) => {
  try {
    const authorRef = doc(db, AUTHORS_COLLECTION, id);
    await deleteDoc(authorRef);
  } catch (error) {
    console.error('Error deleting author:', error);
    throw error;
  }
};

/**
 * Get or create author
 * @param {string} name - Author name
 * @param {string} photo - Author photo (base64)
 * @returns {Promise<string>} - Author ID
 */
export const getOrCreateAuthor = async (name, photo = null) => {
  try {
    // First, try to find existing author
    const existingAuthor = await getAuthorByName(name);
    if (existingAuthor) {
      // If photo is provided and different from existing, update
      if (photo && photo !== existingAuthor.photo) {
        await updateAuthor(existingAuthor.id, { photo });
      }
      return existingAuthor.id;
    }

    // If not found, create new author
    return await createAuthor({ name, photo });
  } catch (error) {
    console.error('Error getting or creating author:', error);
    throw error;
  }
};

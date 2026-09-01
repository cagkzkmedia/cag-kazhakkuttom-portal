/**
 * Song Service - Firebase Integration
 * Handles Firestore operations for songs with tempo and scale filters
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const SONGS_COLLECTION = 'songs';

const normalizeTimestamp = (value) => {
  if (!value) return null;

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const normalizeScale = (value) => {
  if (!value) return 'major-C';

  const normalized = value.toString().trim();
  if (normalized.includes('-')) {
    const [scaleType, scaleKey] = normalized.split('-');
    const safeType = scaleType && (scaleType.toLowerCase() === 'minor' ? 'minor' : 'major');
    const validMajor = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'];
    const validMinor = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D', 'G', 'C', 'F', 'Bb', 'Eb'];
    const safeKey = scaleKey?.trim();

    if (safeType === 'minor' && validMinor.includes(safeKey)) {
      return `minor-${safeKey}`;
    }

    if (safeType === 'major' && validMajor.includes(safeKey)) {
      return `major-${safeKey}`;
    }
  }

  const lowerValue = normalized.toLowerCase();
  if (lowerValue === 'major' || lowerValue === 'minor') {
    return `${lowerValue}-C`;
  }

  if (lowerValue === 'major-c' || lowerValue === 'minor-a') {
    return lowerValue.replace('c', 'C').replace('a', 'A');
  }

  return 'major-C';
};

const normalizeTempo = (value) => {
  const normalized = (value || 'slow').toString().trim().toLowerCase();
  return normalized === 'fast' ? 'fast' : 'slow';
};

export const getSongs = async () => {
  try {
    const songsCol = collection(db, SONGS_COLLECTION);
    const songsQuery = query(songsCol, orderBy('createdAt', 'desc'));
    const songsSnapshot = await getDocs(songsQuery);

    return songsSnapshot.docs.map((songDoc) => {
      const data = songDoc.data();

      return {
        id: songDoc.id,
        ...data,
        createdAt: normalizeTimestamp(data.createdAt),
        updatedAt: normalizeTimestamp(data.updatedAt),
      };
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};

export const createSong = async (songData) => {
  try {
    const newSong = {
      title: (songData.title || '').trim(),
      tempo: normalizeTempo(songData.tempo),
      timeSignature: (songData.timeSignature || '4/4').toString().trim(),
      scale: normalizeScale(songData.scale),
      notes: (songData.notes || '').trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, SONGS_COLLECTION), newSong);

    return {
      id: docRef.id,
      ...newSong,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating song:', error);
    throw error;
  }
};

export const updateSong = async (id, songData) => {
  try {
    const songDoc = doc(db, SONGS_COLLECTION, id);

    await updateDoc(songDoc, {
      ...songData,
      title: (songData.title || '').trim(),
      tempo: normalizeTempo(songData.tempo),
      timeSignature: (songData.timeSignature || '4/4').toString().trim(),
      scale: normalizeScale(songData.scale),
      notes: (songData.notes || '').trim(),
      updatedAt: serverTimestamp(),
    });

    const songs = await getSongs();
    return songs.find((song) => song.id === id) || null;
  } catch (error) {
    console.error('Error updating song:', error);
    throw error;
  }
};

export const deleteSong = async (id) => {
  try {
    await deleteDoc(doc(db, SONGS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting song:', error);
    throw error;
  }
};

export const getAllSongs = getSongs;

const songService = {
  getSongs,
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
};

export default songService;

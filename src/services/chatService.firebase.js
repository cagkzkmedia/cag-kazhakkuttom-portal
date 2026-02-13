import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  getDoc,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Create a new chat session
 */
export const createChatSession = async (visitorName, visitorEmail) => {
  try {
    const sessionRef = await addDoc(collection(db, 'chatSessions'), {
      visitorName,
      visitorEmail,
      status: 'waiting', // waiting, active, closed
      adminId: null,
      adminName: null,
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
      unreadByAdmin: 0,
      unreadByVisitor: 0
    });

    return sessionRef.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

/**
 * Send a message in a chat session
 */
export const sendMessage = async (sessionId, message, senderType, senderName) => {
  try {
    // Add message
    await addDoc(collection(db, 'chatSessions', sessionId, 'messages'), {
      message,
      senderType, // 'visitor' or 'admin'
      senderName,
      timestamp: serverTimestamp(),
      read: false
    });

    // Update session's last message time and unread count
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const updateData = {
      lastMessageAt: serverTimestamp()
    };

    if (senderType === 'visitor') {
      // Increment unread count for admin
      const sessionDoc = await getDoc(sessionRef);
      const currentUnread = sessionDoc.data()?.unreadByAdmin || 0;
      updateData.unreadByAdmin = currentUnread + 1;
    } else {
      // Increment unread count for visitor
      const sessionDoc = await getDoc(sessionRef);
      const currentUnread = sessionDoc.data()?.unreadByVisitor || 0;
      updateData.unreadByVisitor = currentUnread + 1;
    }

    await updateDoc(sessionRef, updateData);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Join a chat session as admin
 */
export const joinChatSession = async (sessionId, adminId, adminName) => {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'active',
      adminId,
      adminName,
      unreadByAdmin: 0
    });
  } catch (error) {
    console.error('Error joining chat session:', error);
    throw error;
  }
};

/**
 * Close a chat session
 */
export const closeChatSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'closed',
      closedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error closing chat session:', error);
    throw error;
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (sessionId, readerType) => {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const updateData = readerType === 'admin' 
      ? { unreadByAdmin: 0 }
      : { unreadByVisitor: 0 };
    
    await updateDoc(sessionRef, updateData);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

/**
 * Listen to chat sessions (for admin)
 */
export const listenToChatSessions = (callback) => {
  const q = query(
    collection(db, 'chatSessions'),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastMessageAt: doc.data().lastMessageAt?.toDate()
    }))
    // Filter waiting and active sessions on client side
    .filter(session => session.status === 'waiting' || session.status === 'active');
    
    callback(sessions);
  }, (error) => {
    console.error('Error listening to chat sessions:', error);
  });
};

/**
 * Listen to messages in a chat session
 */
export const listenToMessages = (sessionId, callback) => {
  const q = query(
    collection(db, 'chatSessions', sessionId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
    callback(messages);
  }, (error) => {
    console.error('Error listening to messages:', error);
  });
};

/**
 * Get chat session by ID
 */
export const getChatSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (sessionDoc.exists()) {
      return {
        id: sessionDoc.id,
        ...sessionDoc.data(),
        createdAt: sessionDoc.data().createdAt?.toDate(),
        lastMessageAt: sessionDoc.data().lastMessageAt?.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting chat session:', error);
    throw error;
  }
};

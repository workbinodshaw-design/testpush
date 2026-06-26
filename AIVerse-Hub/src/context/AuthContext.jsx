import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sign up
  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    // Create their profile document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      displayName,
      bookmarks: [],
      createdAt: new Date().toISOString()
    });
    
    return userCredential;
  };

  // Log in
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Log out
  const logout = () => {
    return signOut(auth);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists in Firestore, if not, create it
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        email: user.email,
        displayName: user.displayName || 'Google User',
        bookmarks: [],
        createdAt: new Date().toISOString()
      });
    }
    
    return result;
  };

  // Subscribe to auth state changes and user bookmarks
  useEffect(() => {
    let unsubscribeBookmarks = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Listen to their live bookmarks
        const userRef = doc(db, 'users', user.uid);
        unsubscribeBookmarks = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserBookmarks(docSnap.data().bookmarks || []);
          } else {
            setUserBookmarks([]);
          }
        });
      } else {
        setUserBookmarks([]);
        if (unsubscribeBookmarks) unsubscribeBookmarks();
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeBookmarks) unsubscribeBookmarks();
    };
  }, []);

  const value = {
    currentUser,
    userBookmarks,
    signup,
    login,
    logout,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

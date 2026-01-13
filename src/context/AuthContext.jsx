import React, { useContext, useState, useEffect, createContext } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, signInWithPopup, signOut, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function googleSignIn() {
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Save/Update user profile in Firestore
                try {
                    const userRef = doc(db, 'users', user.uid);
                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        lastLogin: serverTimestamp()
                    }, { merge: true });
                } catch (error) {
                    console.error("Error saving user profile:", error);
                }
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        googleSignIn,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

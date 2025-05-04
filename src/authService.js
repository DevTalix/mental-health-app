// src/authService.js

import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

/**
 * Register a new user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Login an existing user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logout = () => {
  return signOut(auth);
};

/**
 * Monitor the auth state
 * @param {function} callback
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

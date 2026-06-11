"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db, seedInitialData } from "@/utils/firebase";
import { onAuthStateChanged, User, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, get, set, child } from "firebase/database";

// Firebase RTDB rejects objects with undefined values — strip them before every set()
function stripUndefined<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export type UserRole = "customer" | "driver" | "admin" | "corporate";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  phone?: string;
  companyName?: string;
  balance?: number;
}

interface FirebaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, role: UserRole, customName?: string, customPhone?: string, customCompany?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Run initial data seeding once on startup
  useEffect(() => {
    seedInitialData();
  }, []);

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch profile
        try {
          const dbRef = ref(db);
          const snapshot = await get(child(dbRef, `users/${firebaseUser.uid}`));
          if (snapshot.exists()) {
            setProfile(snapshot.val() as UserProfile);
          } else {
            // Check local storage fallback for user profile
            const localProfile = localStorage.getItem(`profile_${firebaseUser.uid}`);
            if (localProfile) {
              const parsed = JSON.parse(localProfile);
              await set(ref(db, `users/${firebaseUser.uid}`), parsed);
              setProfile(parsed);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login helper (hybrid mock/real Firebase login to make testing extremely easy)
  const login = async (
    email: string,
    role: UserRole,
    customName?: string,
    customPhone?: string,
    customCompany?: string
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      // Clean email and format mock password
      const cleanEmail = email.trim().toLowerCase();
      const mockPassword = "RideXPassword123!";
      let firebaseUser: User;

      try {
        // Try sign in
        const credential = await signInWithEmailAndPassword(auth, cleanEmail, mockPassword);
        firebaseUser = credential.user;
      } catch (err: any) {
        // If not found, create new user
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
          const credential = await createUserWithEmailAndPassword(auth, cleanEmail, mockPassword);
          firebaseUser = credential.user;
        } else {
          throw err;
        }
      }

      // Check or create profile
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${firebaseUser.uid}`));
      let userProfile: UserProfile;

      if (snapshot.exists()) {
        userProfile = snapshot.val() as UserProfile;
        // Keep requested role for ease of switching profiles
        if (userProfile.role !== role) {
          userProfile.role = role;
          await set(ref(db, `users/${firebaseUser.uid}`), stripUndefined(userProfile));
        }
      } else {
        // Build profile — only include optional fields if they have real values
        userProfile = {
          uid: firebaseUser.uid,
          email: cleanEmail,
          name: customName || cleanEmail.split("@")[0].toUpperCase(),
          role: role,
          createdAt: new Date().toISOString(),
          phone: customPhone || "+91 9876543210",
          ...(role === "corporate" && { companyName: customCompany || "Stark Logistics Inc." }),
          ...(role === "corporate" && { balance: 25000 }),
        };
        await set(ref(db, `users/${firebaseUser.uid}`), stripUndefined(userProfile));
      }

      // If driver, sync to /drivers
      if (role === "driver") {
        const driverSnap = await get(child(dbRef, `drivers/${firebaseUser.uid}`));
        if (!driverSnap.exists()) {
          // Add default driver structure
          await set(ref(db, `drivers/${firebaseUser.uid}`), {
            uid: firebaseUser.uid,
            name: userProfile.name,
            status: "online",
            rating: 5.0,
            earnings: 0,
            activeOrderId: "",
            vehicleId: "v1", // Attach to Yamaha FZ by default
            location: { lat: 28.6139, lng: 77.2090 },
            documentVerified: true,
            phone: userProfile.phone
          });
        }
      }

      localStorage.setItem(`profile_${firebaseUser.uid}`, JSON.stringify(userProfile));
      setUser(firebaseUser);
      setProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error("Login process failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user || !profile) return;
    // Merge then strip any undefined values before writing to Firebase
    const newProfile = stripUndefined({ ...profile, ...updated } as UserProfile);
    await set(ref(db, `users/${user.uid}`), newProfile);
    localStorage.setItem(`profile_${user.uid}`, JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  return (
    <FirebaseContext.Provider value={{ user, profile, loading, login, logout, updateProfile }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

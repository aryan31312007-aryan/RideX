import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAyjQsAJ0kHrLj6DlmyD_uQdMZ2_DgyxiE",
  authDomain: "ridex-c65ee.firebaseapp.com",
  databaseURL: "https://ridex-c65ee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ridex-c65ee",
  storageBucket: "ridex-c65ee.firebasestorage.app",
  messagingSenderId: "833922734319",
  appId: "1:833922734319:web:80804e9aba88cc7056e31a",
  measurementId: "G-BG09WPMCSV"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

// Seed default data if empty
export async function seedInitialData() {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "pricing_rules"));
    if (!snapshot.exists()) {
      console.log("Seeding default pricing rules and sample data...");
      
      // Default pricing rules
      await set(ref(db, "pricing_rules"), {
        bike: { id: "bike", name: "Moto Ride / Bike Taxi", baseFare: 30, perKmRate: 8, perMinuteRate: 1.5, type: "bike", icon: "Bike" },
        car: { id: "car", name: "Premium Sedan / Taxi", baseFare: 80, perKmRate: 15, perMinuteRate: 3.0, type: "car", icon: "Car" },
        truck: { id: "truck", name: "Cargo Truck / Delivery", baseFare: 150, perKmRate: 25, perMinuteRate: 5.0, type: "truck", icon: "Truck" }
      });

      // Default sample vehicles
      await set(ref(db, "vehicles"), {
        v1: { id: "v1", type: "bike", plateNumber: "DL-3S-AB-1234", model: "Yamaha FZ", driverId: "d1" },
        v2: { id: "v2", type: "car", plateNumber: "HR-26-CD-5678", model: "Hyundai Verna", driverId: "d2" },
        v3: { id: "v3", type: "truck", plateNumber: "MH-12-EF-9012", model: "Tata Ace", driverId: "d3" }
      });

      // Default sample drivers
      await set(ref(db, "drivers"), {
        d1: { uid: "d1", name: "Amit Kumar", status: "online", rating: 4.8, earnings: 1540, activeOrderId: "", vehicleId: "v1", location: { lat: 28.6139, lng: 77.2090 }, documentVerified: true, phone: "+91 9999999901" },
        d2: { uid: "d2", name: "Suresh Raina", status: "online", rating: 4.6, earnings: 3200, activeOrderId: "", vehicleId: "v2", location: { lat: 28.6250, lng: 77.2200 }, documentVerified: true, phone: "+91 9999999902" },
        d3: { uid: "d3", name: "Vikram Singh", status: "offline", rating: 4.9, earnings: 8900, activeOrderId: "", vehicleId: "v3", location: { lat: 28.5900, lng: 77.1900 }, documentVerified: false, phone: "+91 9999999903" }
      });
      
      console.log("Seeding complete!");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}

export { app, auth, db };

import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";

const SEED_DATA = {
  founder: {
    name: "Dinesh Pandey",
    phone: "9425331205",
    role: "Founder & Premier Tour Operator",
    headquarter: "Bandhavgarh National Park, MP",
    bio: "Dinesh Pandey (+91 9425331205) is the proud business owner of Pandey Tiger Safaris in Bandhavgarh. Dinesh provides end-to-end tour and travel management—offering complete safari packages, luxury vehicle fleets (Innova Crysta, Force Traveller, Swift Dzire), and an army of Bandhavgarh's finest licensed forest guides and tiger trackers on demand.",
    image_url: "/dinesh-pandey.jpg"
  },
  // Default Fleet with High-Resolution Real Vehicle Photos from Unsplash
  cars: [
    { 
      id: "car_1", 
      name: "Toyota Innova Crysta", 
      category: "Premium SUV Transport", 
      capacity: 7, 
      image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200", 
      description: "White 7-seater premium AC MPV/SUV for smooth transfers from Katni or Jabalpur." 
    },
    { 
      id: "car_2", 
      name: "Force Traveller", 
      category: "Group Luxury Minibus", 
      capacity: 13, 
      image_url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200", 
      description: "Spacious AC minibus ideal for family groups and corporate wildlife expeditions." 
    },
    { 
      id: "car_3", 
      name: "Maruti Suzuki Swift Dzire", 
      category: "Comfort Sedan", 
      capacity: 4, 
      image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200", 
      description: "Fuel-efficient AC sedan for small families and airport/railway station pickups." 
    },
    { 
      id: "car_4", 
      name: "Open 4x4 Maruti Suzuki Gypsy", 
      category: "Jungle Safari Jeep", 
      capacity: 6, 
      image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200", 
      description: "Forest-department authorized open 4x4 jeep for safari tracks in Tala, Magdhi & Khitauli." 
    },
    { 
      id: "car_5", 
      name: "Personal / Custom Request Vehicle", 
      category: "Tailored Fleet", 
      capacity: 0, 
      image_url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200", 
      description: "Bespoke personal vehicle requests accommodated directly by Dinesh Pandey." 
    }
  ],
  packages: [], // Managed dynamically from Admin
  drivers: [],  // Managed dynamically from Admin
  reviews: [
    { id: "rev_1", author: "Ananya Sharma", location: "Delhi, India", rating: 5, comment: "Dinesh Pandey (+91 9425331205) organized our entire package and provided the best forest guide. Top service!" },
    { id: "rev_2", author: "Suresh Kothari", location: "Mumbai, India", rating: 5, comment: "Booked an Innova Crysta and complete tour with Dinesh Ji. Everything was seamless!" }
  ],
  contact: {
    hq_address: "Tala Gate Road, Near Bandhavgarh National Park, Umaria, MP - 484661",
    phone: "9425331205",
    email: "dinesh@pandeytigersafaris.com"
  }
};

async function getCollectionData(collectionName: string, fallbackData: any) {
  if (typeof window === "undefined") {
    return fallbackData;
  }

  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return fallbackData;
  } catch (error) {
    return fallbackData;
  }
}

export async function fetchFromAPI(endpoint: string) {
  switch (endpoint) {
    case "/founder":
      return getCollectionData("founder", SEED_DATA.founder);
    case "/packages":
      return getCollectionData("packages", SEED_DATA.packages);
    case "/cars":
      return getCollectionData("cars", SEED_DATA.cars);
    case "/drivers":
      return getCollectionData("drivers", SEED_DATA.drivers);
    case "/reviews":
      return getCollectionData("reviews", SEED_DATA.reviews);
    case "/contact":
      return getCollectionData("contact", SEED_DATA.contact);
    case "/availability":
      const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return { id: `date_${i}`, date: d.toISOString().split("T")[0], is_available: true };
      });
      return dates;
    default:
      return null;
  }
}

export async function submitBooking(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...payload,
      createdAt: serverTimestamp(),
      booking_source: payload.booking_source || "web_prepaid",
      payment_status: payload.payment_status || "Advance Paid",
    });
    return { status: "success", booking_id: docRef.id, message: "Safari booking saved!" };
  } catch (error: any) {
    console.error("Booking error:", error);
    return { status: "error", message: error.message };
  }
}

export async function addTourPackage(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "packages"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { status: "success", package_id: docRef.id };
  } catch (error: any) {
    console.error("Error adding package:", error);
    return { status: "error", message: error.message };
  }
}

export async function addDriver(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "drivers"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { status: "success", driver_id: docRef.id };
  } catch (error: any) {
    console.error("Error adding driver:", error);
    return { status: "error", message: error.message };
  }
}

export async function submitCustomPackage(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "custom_packages"), {
      ...payload,
      createdAt: serverTimestamp(),
      assignedTo: "Dinesh Pandey (9425331205)"
    });
    return { status: "success", request_id: docRef.id };
  } catch (error: any) {
    console.error("Custom package error:", error);
    return { status: "error", message: error.message };
  }
}

import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
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
    bio: "Dinesh Pandey (+91 9425331205) is the proud business owner of Pandey Tiger Safaris across Madhya Pradesh's tiger reserves. Dinesh provides end-to-end tour and travel management—offering complete safari packages, luxury vehicle fleets (Innova Crysta, Force Traveller, Swift Dzire), and an army of licensed forest guides and tiger trackers on demand.",
    image_url: "/dinesh-pandey.jpg"
  },
  parks: [
    { id: "park_1", name: "Bandhavgarh National Park", state: "Madhya Pradesh", image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800" },
    { id: "park_2", name: "Kanha National Park", state: "Madhya Pradesh", image_url: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=800" },
    { id: "park_3", name: "Pench National Park", state: "Madhya Pradesh", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" },
    { id: "park_4", name: "Panna National Park", state: "Madhya Pradesh", image_url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800" },
    { id: "park_5", name: "Satpura National Park", state: "Madhya Pradesh", image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" }
  ],
  cars: [
    { 
      id: "car_1", 
      name: "Toyota Innova Crysta", 
      category: "Premium SUV Transport", 
      capacity: 7, 
      image_url: "https://www.team-bhp.com/sites/default/files/styles/check_extra_large_for_review/public/innova-crysta-2.jpg", 
      description: "White 7-seater AC SUV for smooth transfers from Katni, Jabalpur or Umaria.",
      is_representative: true
    },
    { 
      id: "car_2", 
      name: "Force Traveller", 
      category: "Group Luxury Minibus", 
      capacity: 13, 
      image_url: "https://5.imimg.com/data5/IK/YH/GLADMIN-9705085/force-tempo-traveller-1000x1000.jpg", 
      description: "Spacious AC minibus ideal for family groups and corporate wildlife expeditions.",
      is_representative: true
    },
    { 
      id: "car_3", 
      name: "Maruti Suzuki Swift Dzire", 
      category: "Comfort Sedan", 
      capacity: 4, 
      image_url: "https://i.ndtvimg.com/i/2017-06/maruti-suzuki-dzire-styling_827x510_81498479945.jpg", 
      description: "Fuel-efficient AC sedan for small families and station pickups.",
      is_representative: true
    },
    { 
      id: "car_4", 
      name: "Open 4x4 Maruti Suzuki Gypsy", 
      category: "Jungle Safari Jeep", 
      capacity: 6, 
      image_url: "https://www.team-bhp.com/sites/default/files/pictures2021/gypsy-7.jpeg", 
      description: "Forest-department authorized open 4x4 jeep for safari tracks in Tala, Magdhi & Khitauli.",
      is_representative: true
    },
    { 
      id: "car_5", 
      name: "Personal / Custom Request Vehicle", 
      category: "Tailored Fleet", 
      capacity: 0, 
      image_url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200", 
      description: "Bespoke personal vehicle requests accommodated directly by Dinesh Pandey.",
      is_representative: true
    }
  ],
  packages: [],
  drivers: [],
  blocked_dates: [],
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
    case "/parks":
      return getCollectionData("parks", SEED_DATA.parks);
    case "/packages":
      const allPkgs: any[] = await getCollectionData("packages", SEED_DATA.packages);
      return Array.isArray(allPkgs) ? allPkgs.filter((p: any) => !p.is_archived) : [];
    case "/cars":
      return getCollectionData("cars", SEED_DATA.cars);
    case "/drivers":
      return getCollectionData("drivers", SEED_DATA.drivers);
    case "/blocked_dates":
      return getCollectionData("blocked_dates", SEED_DATA.blocked_dates);
    case "/reviews":
      return getCollectionData("reviews", SEED_DATA.reviews);
    case "/contact":
      return getCollectionData("contact", SEED_DATA.contact);
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
    return { status: "success", booking_id: docRef.id };
  } catch (error: any) {
    console.error("Booking error:", error);
    return { status: "error", message: error.message };
  }
}

export async function archiveTourPackage(id: string) {
  try {
    await setDoc(doc(db, "packages", id), { is_archived: true }, { merge: true });
    return { status: "success" };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function unarchiveTourPackage(id: string) {
  try {
    await setDoc(doc(db, "packages", id), { is_archived: false }, { merge: true });
    return { status: "success" };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function deleteTourPackagePermanently(id: string) {
  try {
    await deleteDoc(doc(db, "packages", id));
    return { status: "success" };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function blockBookingDate(payload: { date: string; reason: string }) {
  try {
    const docRef = await addDoc(collection(db, "blocked_dates"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { status: "success", id: docRef.id };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function unblockBookingDate(id: string) {
  try {
    await deleteDoc(doc(db, "blocked_dates", id));
    return { status: "success" };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function addTourPackage(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "packages"), {
      ...payload,
      is_archived: false,
      createdAt: serverTimestamp(),
    });
    return { status: "success", package_id: docRef.id };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function addVehicle(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "cars"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { status: "success", vehicle_id: docRef.id };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}

export async function addNationalPark(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "parks"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { status: "success", park_id: docRef.id };
  } catch (error: any) {
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
    return { status: "error", message: error.message };
  }
}

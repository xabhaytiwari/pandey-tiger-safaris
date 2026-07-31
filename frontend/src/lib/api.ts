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

export const PARK_PROFILES: Record<string, any> = {
  bandhavgarh: {
    slug: "bandhavgarh",
    name: "Bandhavgarh National Park",
    state: "Madhya Pradesh",
    district: "Umaria",
    established: "1968",
    area_sq_km: 1536,
    tiger_density: "Highest Tiger Density in India (approx. 1 tiger per 4 sq km)",
    tagline: "The Royal Bengal Sanctuary & Ancient Fort",
    hero_image: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/279646059399eaba1015ba0275a5690b507b65f2.jpg",
    overview: "Bandhavgarh National Park is world-renowned for having the highest density of Royal Bengal tigers in India. Surrounded by steep sandstone cliffs and ancient 2000-year-old fort ruins, Bandhavgarh offers unmatched tiger tracking opportunities across Tala, Magdhi, and Khitauli zones.",
    best_season: "October 1st to June 30th (Peak sightings in March–May near waterholes)",
    zones: [
      { name: "Tala Zone (Gate 1)", desc: "The iconic core zone. Features Shesh Shaiya (65ft carved Vishnu idol), Bandhavgarh Fort, and high tiger density." },
      { name: "Magdhi Zone (Gate 2)", desc: "Open grasslands, bamboo hillocks, and waterholes. Home to large male tiger territories." },
      { name: "Khitauli Zone (Gate 3)", desc: "Bamboo forests and rocky hills. Excellent for leopards, sloth bears, and birdwatching." }
    ],
    fauna: ["Royal Bengal Tiger", "Leopard", "Sloth Bear", "Gaur (Indian Bison)", "Chital", "Sambar", "Barking Deer", "250+ Bird Species"]
  },
  kanha: {
    slug: "kanha",
    name: "Kanha National Park",
    state: "Madhya Pradesh",
    district: "Mandla / Balaghat",
    established: "1955",
    area_sq_km: 2051,
    tiger_density: "Vast Core Tiger Reserve (over 120+ tigers)",
    tagline: "Land of the Barasingha & Evergreen Sal Forests",
    hero_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrZoWc_WzK25PAeBO-8XQb3gf8AgEfVEnridQ2osZ7Eci7pYCYmDrE3yes&s=10",
    overview: "Kanha Tiger Reserve is the lush meadow setting that inspired Rudyard Kipling. Famous for its successful conservation of the rare Hard-Ground Barasingha (Swamp Deer), Kanha features dramatic bamboo and sal forest landscapes with dense tiger activity.",
    best_season: "October to June (Nov–Feb for lush weather; Mar–May for tiger sightings)",
    zones: [
      { name: "Mukki Zone", desc: "Famous for frequent tiger sightings along stream beds and sal trees." },
      { name: "Khatia Zone", desc: "Dense sal forest canopy with high herbivore and tiger density." },
      { name: "Kanha Zone", desc: "Vast scenic meadows and central waterholes." }
    ],
    fauna: ["Royal Bengal Tiger", "Hard-Ground Barasingha", "Leopard", "Wild Dog (Dhole)", "Gaur", "Chital"]
  },
  pench: {
    slug: "pench",
    name: "Pench National Park",
    state: "Madhya Pradesh",
    district: "Seoni / Chhindwara",
    established: "1975",
    area_sq_km: 1180,
    tiger_density: "High Tiger & Leopard Density",
    tagline: "The Real Jungle Book Country",
    hero_image: "https://indiantigersafaris.com/wp-content/uploads/2025/10/Pench-Tiger-Safari-Tour-Package.webp",
    overview: "Pench National Park flows along the Pench River, serving as the real-life setting for Rudyard Kipling's 'The Jungle Book'. Blessed with open teak forests, Pench offers superb visibility for tracking tigers, leopards, and wild dog packs.",
    best_season: "October 15th to June 30th",
    zones: [
      { name: "Turia Gate", desc: "The main safari gate with waterbodies and prime tiger movement." },
      { name: "Karmajhiri Gate", desc: "Secluded core forest with dense teak canopy." }
    ],
    fauna: ["Royal Bengal Tiger", "Indian Leopard", "Wild Dog (Dhole)", "Sloth Bear", "Chousingha (Four-horned Antelope)"]
  },
  panna: {
    slug: "panna",
    name: "Panna National Park",
    state: "Madhya Pradesh",
    district: "Panna / Chhatarpur",
    established: "1981",
    area_sq_km: 1645,
    tiger_density: "Thriving Reintroduced Tiger Population",
    tagline: "Ken River Gorges & Reintroduced Tigers",
    hero_image: "https://images.pexels.com/photos/21896819/pexels-photo-21896819.jpeg",
    overview: "Panna Tiger Reserve is one of India's greatest wildlife restoration stories. Situated along the turquoise gorges of the Ken River, Panna offers river boat safaris alongside 4x4 open jeep tracking.",
    best_season: "October to June",
    zones: [
      { name: "Madla Gate", desc: "Near Ken River, famous for crocodile boat safaris and tiger tracking." },
      { name: "Hinouta Gate", desc: "Plateau and gorge terrain for leopards and sloth bears." }
    ],
    fauna: ["Royal Bengal Tiger", "Leopard", "Gharial & Mugger Crocodile", "Sloth Bear", "King Vulture"]
  },
  satpura: {
    slug: "satpura",
    name: "Satpura National Park",
    state: "Madhya Pradesh",
    district: "Hoshangabad",
    established: "1981",
    area_sq_km: 2133,
    tiger_density: "Secluded Untamed Wilderness",
    tagline: "Sandstone Peaks, Canoeing & Walking Safaris",
    hero_image: "https://images.unsplash.com/photo-1500463959177-e0869687df26?auto=format&fit=crop&q=80&w=800",
    overview: "Satpura Tiger Reserve is unique in offering canoe safaris, walking forest patrols, and night drives along sandstone ravines and Denwa River backwaters. A peaceful haven for leopards, sloth bears, and tigers.",
    best_season: "October 1st to June 30th",
    zones: [
      { name: "Panaarpani / Madhai", desc: "Main entry via boat across Denwa River into core jungle." }
    ],
    fauna: ["Royal Bengal Tiger", "Leopard", "Sloth Bear", "Indian Giant Squirrel", "Gaur", "Crested Serpent Eagle"]
  }
};

const SEED_DATA = {
  founder: {
    name: "Dinesh Pandey",
    phone: "9425331205",
    role: "Founder & Premier Tour Operator",
    headquarter: "Bandhavgarh National Park, MP",
    bio: "Dinesh Pandey (+91 9425331205) is the proud business owner of Pandey Tiger Safaris across Madhya Pradesh's tiger reserves. Dinesh provides end-to-end tour and travel management—offering complete safari packages, luxury vehicle fleets (Innova Crysta, Force Traveller, Swift Dzire), and an army of Bandhavgarh's finest licensed forest guides and tiger trackers on demand.",
    image_url: "/dinesh-pandey.jpg"
  },
  parks: [
    { id: "park_1", slug: "bandhavgarh", name: "Bandhavgarh National Park", state: "Madhya Pradesh", image_url: "https://bandhavgarhtigerreserve.org/storage/app/public/gallery/279646059399eaba1015ba0275a5690b507b65f2.jpg" },
    { id: "park_2", slug: "kanha", name: "Kanha National Park", state: "Madhya Pradesh", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrZoWc_WzK25PAeBO-8XQb3gf8AgEfVEnridQ2osZ7Eci7pYCYmDrE3yes&s=10" },
    { id: "park_3", slug: "pench", name: "Pench National Park", state: "Madhya Pradesh", image_url: "https://indiantigersafaris.com/wp-content/uploads/2025/10/Pench-Tiger-Safari-Tour-Package.webp" },
    { id: "park_4", slug: "panna", name: "Panna National Park", state: "Madhya Pradesh", image_url: "https://images.pexels.com/photos/21896819/pexels-photo-21896819.jpeg" },
    { id: "park_5", slug: "satpura", name: "Satpura National Park", state: "Madhya Pradesh", image_url: "https://images.unsplash.com/photo-1500463959177-e0869687df26?auto=format&fit=crop&q=80&w=800" }
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

export async function createSocialPost(payload: any) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...payload,
      likes_count: 0,
      createdAt: serverTimestamp(),
    });
    return { status: "success", post_id: docRef.id };
  } catch (error: any) {
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

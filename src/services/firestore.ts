import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Website, Collection } from "@/types";
import { 
  validateUrl, 
  validateCollectionName, 
  validateCollectionDescription,
  validateWebsiteName 
} from "@/lib/validators";
import { sanitizeXSS, sanitizeUrl } from "@/lib/security";

/**
 * Service for handling all Firestore operations related to Websites and Collections.
 * This decouples the UI from the database implementation.
 */
export const FirestoreService = {
  // --- WEBSITES ---

  /**
   * Listen to real-time updates for a user's websites
   */
  subscribeToWebsites: (userId: string, callback: (websites: Website[]) => void) => {
    if (!userId || !db) {
      console.warn("FirestoreService: userId and db are required for subscribeToWebsites");
      return () => {};
    }
    
    const q = query(
      collection(db, "websites"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const websites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Website[];
      callback(websites);
    });
  },

  /**
   * Add a new website inspiration with validation
   */
  addWebsite: async (websiteData: Omit<Website, "id" | "createdAt">) => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    // Validate required fields
    if (!websiteData.userId) {
      throw new Error("User ID is required");
    }

    // Validate URL
    const urlValidation = validateUrl(websiteData.url);
    if (!urlValidation.valid) {
      throw new Error(urlValidation.error || "Invalid URL");
    }

    // Sanitize inputs
    const sanitizedData = {
      ...websiteData,
      websiteName: sanitizeXSS(websiteData.websiteName, 200),
      url: sanitizeUrl(websiteData.url),
      thumbnailUrl: sanitizeUrl(websiteData.thumbnailUrl),
      faviconUrl: sanitizeUrl(websiteData.faviconUrl),
      websiteTitle: sanitizeXSS(websiteData.websiteTitle, 500),
      websiteDescription: sanitizeXSS(websiteData.websiteDescription, 2000),
      tags: websiteData.tags ? websiteData.tags.slice(0, 20).map(tag => sanitizeXSS(tag, 50)) : [],
      isFavorite: !!websiteData.isFavorite,
    };

    return addDoc(collection(db, "websites"), {
      ...sanitizedData,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Update an existing website with validation
   */
  updateWebsite: async (id: string, data: Partial<Website>) => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    if (!id) {
      throw new Error("Website ID is required");
    }

    // Sanitize allowed fields only
    const allowedUpdates: Partial<Website> = {};
    
    if (data.websiteName !== undefined) {
      const nameValidation = validateWebsiteName(data.websiteName);
      if (!nameValidation.valid) {
        throw new Error(nameValidation.error || "Invalid website name");
      }
      allowedUpdates.websiteName = sanitizeXSS(data.websiteName, 200);
    }
    
    if (data.websiteTitle !== undefined) {
      allowedUpdates.websiteTitle = sanitizeXSS(data.websiteTitle, 500);
    }
    
    if (data.websiteDescription !== undefined) {
      allowedUpdates.websiteDescription = sanitizeXSS(data.websiteDescription, 2000);
    }
    
    if (data.tags !== undefined) {
      allowedUpdates.tags = data.tags.slice(0, 20).map(tag => sanitizeXSS(tag, 50));
    }
    
    if (data.isFavorite !== undefined) {
      allowedUpdates.isFavorite = !!data.isFavorite;
    }
    
    if (data.collectionId !== undefined) {
      allowedUpdates.collectionId = sanitizeXSS(data.collectionId, 100);
    }

    const docRef = doc(db, "websites", id);
    return updateDoc(docRef, allowedUpdates);
  },

  /**
   * Delete a website
   */
  deleteWebsite: async (id: string) => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    if (!id) {
      throw new Error("Website ID is required");
    }
    return deleteDoc(doc(db, "websites", id));
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (id: string, isFavorite: boolean) => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    if (!id) {
      throw new Error("Website ID is required");
    }
    return updateDoc(doc(db, "websites", id), { isFavorite: !!isFavorite });
  },

  // --- COLLECTIONS ---

  /**
   * Listen to real-time updates for a user's collections
   */
  subscribeToCollections: (userId: string, callback: (collections: Collection[]) => void) => {
    if (!userId || !db) {
      console.warn("FirestoreService: userId and db are required for subscribeToCollections");
      return () => {};
    }
    
    const q = query(
      collection(db, "collections"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const collections = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Collection[];
      callback(collections);
    });
  },

  /**
   * Get all collections for a user (one-time fetch)
   */
  getCollections: async (userId: string): Promise<Collection[]> => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const q = query(collection(db, "collections"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Collection[];
  },

  /**
   * Add a new collection with validation
   */
  addCollection: async (userId: string, name: string, description: string) => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate inputs
    const nameValidation = validateCollectionName(name);
    if (!nameValidation.valid) {
      throw new Error(nameValidation.error || "Invalid collection name");
    }

    const descValidation = validateCollectionDescription(description);
    if (!descValidation.valid) {
      throw new Error(descValidation.error || "Invalid description");
    }

    // Sanitize inputs
    const sanitizedData = {
      userId,
      name: sanitizeXSS(name, 100),
      description: sanitizeXSS(description, 500),
    };

    return addDoc(collection(db, "collections"), {
      ...sanitizedData,
      createdAt: serverTimestamp(),
    });
  },

  /**
   * Delete a collection
   */
  deleteCollection: async (id: string) => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    if (!id) {
      throw new Error("Collection ID is required");
    }
    return deleteDoc(doc(db, "collections", id));
  },

  /**
   * Get a specific collection by ID
   */
  getCollectionById: async (id: string): Promise<Collection | null> => {
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    if (!id) {
      throw new Error("Collection ID is required");
    }
    
    const docRef = doc(db, "collections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Collection;
    }
    return null;
  },

  /**
   * Get websites for a specific collection
   */
  subscribeToCollectionWebsites: (userId: string, collectionId: string, callback: (websites: Website[]) => void) => {
    if (!userId || !collectionId || !db) {
      console.warn("FirestoreService: userId, collectionId and db are required");
      return () => {};
    }
    
    const q = query(
      collection(db, "websites"),
      where("userId", "==", userId),
      where("collectionId", "==", collectionId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const websites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Website[];
      callback(websites);
    });
  }
};

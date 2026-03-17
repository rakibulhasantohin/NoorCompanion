const DB_NAME = 'quran-db';
const STORE_NAME = 'surahs';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'number' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });
  
  return dbPromise;
}

let fetchPromise: Promise<any> | null = null;

export async function getSurahWithBengaliPronunciation(surahId: number) {
  try {
    const db = await openDB();
    
    // Check if it exists in DB
    const cachedSurah = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(surahId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (cachedSurah) {
      return cachedSurah;
    }

    // If not, fetch the 10MB file (ensure only one concurrent fetch)
    if (!fetchPromise) {
      fetchPromise = (async () => {
        const response = await fetch('https://cdn.jsdelivr.net/gh/Khalidhassan3011/al_quran@master/lib/src/data/full_quran_data.dart');
        if (!response.ok) throw new Error('Failed to fetch Quran data');
        
        const text = await response.text();
        
        // Extract JSON from Dart file
        const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (!match) throw new Error('Failed to parse Quran data');
        
        const allSurahs = JSON.parse(match[0]);
        
        // Save all surahs to DB
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          for (const surah of allSurahs) {
            store.put(surah);
          }
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
        
        return allSurahs;
      })();
    }
    
    const allSurahs = await fetchPromise;
    return allSurahs.find((s: any) => s.number === surahId);
  } catch (error) {
    fetchPromise = null; // Reset on error
    console.error('Error fetching surah with pronunciation:', error);
    throw error;
  }
}

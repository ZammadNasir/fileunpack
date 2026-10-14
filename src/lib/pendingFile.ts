const DB_NAME = "fileunpack";
const DB_VERSION = 1;
const STORE_NAME = "session";
const PENDING_FILE_KEY = "pending-file";

let memoryFile: File | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode);
      const request = run(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    database.close();
  }
}

export async function savePendingFile(file: File) {
  memoryFile = file;
  try {
    await withStore("readwrite", (store) => store.put(file, PENDING_FILE_KEY));
  } catch {
    // IndexedDB unavailable (private mode, storage blocked): memory fallback still covers client-side navigation.
  }
}

export async function readPendingFile(): Promise<File | null> {
  if (memoryFile) return memoryFile;
  try {
    const stored = await withStore<File | undefined>("readonly", (store) => store.get(PENDING_FILE_KEY));
    if (stored instanceof File) {
      memoryFile = stored;
      return stored;
    }
  } catch {
    // Fall through to the empty state below.
  }
  return null;
}

export async function clearPendingFile() {
  memoryFile = null;
  try {
    await withStore("readwrite", (store) => store.delete(PENDING_FILE_KEY));
  } catch {
    // Nothing else to clean up.
  }
}

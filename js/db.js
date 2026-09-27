const DB_NAME = 'plzdraw_db';
const DB_VERSION = 1;
let db = null;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains('strokes')) {
        db.createObjectStore('strokes', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };

    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveStrokeToLocal(strokeData) {
  if (!db) await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('strokes', 'readwrite');
    const store = tx.objectStore('strokes');
    store.add(strokeData);
    tx.oncomplete = () => resolve();
  });
}

async function getLocalStrokes() {
  if (!db) await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction('strokes', 'readonly');
    const store = tx.objectStore('strokes');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
}


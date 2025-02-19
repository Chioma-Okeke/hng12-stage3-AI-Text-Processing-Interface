const DB_NAME = "chatsDB";
const STORE_NAME = "chats";
const DB_VERSION = 1;

export const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true,
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error opening IndexedDB");
    });
};

export const saveMessagesToDB = async (ticketData) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.add(ticketData);
    } catch (error) {
        console.error("Error saving ticket to IndexedDB:", error);
    }
};

export const getMessagesFromDB = async () => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Error retrieving tickets");
        });
    } catch (error) {
        console.error("Error retrieving tickets from IndexedDB:", error);
    }
};

export const clearMessagesDB = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.clear();
    } catch (error) {
        console.error("Error clearing IndexedDB:", error);
    }
};

export const deleteMessage = async (id) => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    const deleteRequest = store.delete(id);
                    deleteRequest.onsuccess = () => resolve(true);
                    deleteRequest.onerror = () =>
                        reject("Failed to delete entry.");
                } else {
                    resolve(false);
                }
            };

            getRequest.onerror = () => reject("Failed to retrieve entry.");
        });
    } catch (error) {
        console.error("Error deleting entry from IndexedDb:", error);
    }
};

export const clearLocalStorage = async () => {
    localStorage.removeItem("CurrentMessages");
    
};

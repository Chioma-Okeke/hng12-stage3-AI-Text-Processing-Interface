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

export const saveMessagesToDB = async (messageData) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        await store.add(messageData);
        await transaction.done

        return true
    } catch (error) {
        throw new Error(`Error saving messages to IndexedDB: ${error.message}`);
    }
};

export const getMessagesFromDB = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject("Error retrieving tickets");
        });
    } catch (error) {
        throw new Error(`Error fetching chats: ${error.message}`);
    }
};

export const updateMessagesDB = async (chatId, updateMessage) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const existingMessage = await store.get(chatId);

        if (!existingMessage) {
            throw new Error("Chat not found");
        }

        const updatedData = { ...existingMessage, ...updateMessage, id: chatId };
        await store.put(updatedData);

        await transaction.done;
    } catch (error) {
        throw new Error(`Error updating chat: ${error.message}`);
    }
};

export const clearMessagesDB = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        await store.clear();
        await transaction.done;

        return true;
    } catch (error) {
        throw new Error(`Error deleting chat: ${error.message}`);
    }
};

export const deleteMessage = async (chatId) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const existingMessage = await store.get(chatId);

        if (!existingMessage) {
            return false;
        }

        await store.delete(chatId);
        await transaction.done;

        return true;
    } catch (error) {
        throw new Error(`Error deleting chat: ${error.message}`);
    }
};

export const isChatExisting = async (chatId) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        const existingMessage = await store.get(chatId);

        if (!existingMessage) {
            return false;
        }

        return true
    } catch (error) {
        throw new Error(`Error checking chat availability: ${error.message}`);
    }
}

export const clearLocalStorage = async () => {
    localStorage.removeItem("CurrentMessages");
    localStorage.removeItem("currentChat");
};

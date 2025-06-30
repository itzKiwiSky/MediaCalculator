// MiniDB para IndexedDB - versão estática
export default class RegistroController {
    static dbName = "MiniDB";
    static storeName = "registros";
    static dbPromise = RegistroController._openDB();

    static _openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(RegistroController.dbName, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(RegistroController.storeName)) {
                    db.createObjectStore(RegistroController.storeName, { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    static async add(item) {
        const db = await RegistroController.dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RegistroController.storeName, "readwrite");
            const store = tx.objectStore(RegistroController.storeName);
            const req = store.add(item);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    static async getAll() {
        const db = await RegistroController.dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RegistroController.storeName, "readonly");
            const store = tx.objectStore(RegistroController.storeName);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    static async getById(id) {
        const db = await RegistroController.dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RegistroController.storeName, "readonly");
            const store = tx.objectStore(RegistroController.storeName);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    static async update(id, newData) {
        const db = await RegistroController.dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RegistroController.storeName, "readwrite");
            const store = tx.objectStore(RegistroController.storeName);
            const req = store.put({ ...newData, id });
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    static async remove(id) {
        const db = await RegistroController.dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RegistroController.storeName, "readwrite");
            const store = tx.objectStore(RegistroController.storeName);
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }
}

// Exemplo de uso:
// import RegistroController from './RegistroController.js';
// await RegistroController.add({ nome: 'teste', listLitros: [10, 20] });
// const todos = await RegistroController.getAll();
// await RegistroController.update(1, { nome: 'novo', listLitros: [30] });
// await RegistroController.remove(1);

const DB_NAME = "MyFinanceDB";
const DB_VERSION = 1;
const STORE_NAMES = ["mouvements", "solde", "projets", "dettes", "source", "depenses", "user"];

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            for (const storeName of STORE_NAMES) {
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, { keyPath: "time", autoIncrement: storeName !== "user" });
                    if (storeName === "user") {
                        store.createIndex("id", "id", { unique: true });
                    }
                }
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function initDB() {
    const db = await openDB();
    for (const storeName of STORE_NAMES) {
        const data = await getAll(storeName);
        if (data.length === 0) {
            if (storeName === "solde") {
                await add(storeName, { CDF: 0, USD: 0, time: Date.now(), user: 1 });
            } else if (storeName === "user") {
                await add(storeName, { id: 1, username: "Frank M.", time: Date.now() });
            }
        }
    }
}

async function getAll(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function add(storeName, data) {
    const db = await openDB();
    const time = Date.now();
    const user = await getUser();
    const newData = { ...data, time, user: user?.id || 1 };
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.add(newData);
        tx.oncomplete = () => resolve(newData);
        tx.onerror = () => reject(tx.error);
    });
}

async function update(storeName, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.put(data);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

async function getFiltered(storeName, column, value) {
    const all = await getAll(storeName);
    return all.filter(item => item[column] === value);
}

async function deleteByTime(storeName, time) {
    const db = await openDB();
    const records = await getAll(storeName);
    const lineToDelete = records.find(r => r.time === time);

    if (lineToDelete && confirm("Voulez-vous vraiment supprimer cette ligne de la table " + storeName + " ?")) {
        const soldeRecords = await getAll("solde");
        let lastS = soldeRecords[soldeRecords.length - 1];

        if (lineToDelete.type === "Entrer" || lineToDelete.type === "Empreunter") {
            lastS[lineToDelete.devise] -= Number(lineToDelete.somme);
        } else {
            lastS[lineToDelete.devise] += Number(lineToDelete.somme);
        }

        await update("solde", { ...lastS, time: Date.now(), user: lastS.user });
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            store.delete(time);
            tx.oncomplete = () => {
                load(); // recharge les données si tu as cette fonction
                resolve(true);
            };
            tx.onerror = () => reject(tx.error);
        });
    }
}

async function getUser() {
    const users = await getAll("user");
    return users[0];
}

// Appeler ceci au début de l'application
initDB();

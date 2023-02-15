import { useEffect, useState } from "react";

/**
 * @template T
 * @template {Record<string, unknown>} StoreMap
 * @typedef {{
 *  readonly autoIncrement: boolean;
 *  readonly indexNames: DOMStringList;
 *  readonly keyPath: string | string[];
 *  name: string;
 *  readonly transaction: TypedIDBTransaction<StoreMap>;
 *  add(value: T, key?: IDBValidKey): IDBRequest<IDBValidKey>;
 *  clear(): IDBRequest<void>;
 *  count(query?: IDBValidKey | IDBKeyRange): IDBRequest<number>;
 *  createIndex(name: string, keyPath: string | string[], options?: IDBIndexParameters): IDBIndex;
 *  deleteIndex(name: string): void;
 *  delete(query: IDBValidKey | IDBKeyRange): IDBRequest<void>;
 *  get(query: IDBValidKey | IDBKeyRange): IDBRequest<T>;
 *  getAll(query?: IDBValidKey | IDBKeyRange | null, count?: number): IDBRequest<T[]>;
 *  index(name: string): IDBIndex;
 *  put(value: T, key?: IDBValidKey): IDBRequest<IDBValidKey>;
 * }} TypedIDBObjectStore
 */
/**
 * @template {Record<string, unknown>} StoreMap
 * @typedef {{
 *  readonly db: TypedIDBDatabase<StoreMap>;
 *  readonly durability: IDBTransactionDurability;
 *  readonly error: DOMException?;
 *  readonly mode: IDBTransactionMode;
 *  readonly objectStoreNames: DOMStringList;
 *  onabort: ((this: IDBTransaction, ev: Event) => any)?;
 *  oncomplete: ((this: IDBTransaction, ev: Event) => any)?;
 *  onerror: ((this: IDBTransaction, ev: Event) => any)?;
 *  abort(): void;
 *  commit(): void;
 *  objectStore<T extends keyof StoreMap>(name: T): TypedIDBObjectStore<StoreMap[T], StoreMap>;
 * }} TypedIDBTransaction
 */
/**
 * @template {Record<string, unknown>} StoreMap
 * @typedef {{
 *  readonly name: string;
 *  readonly objectStoreNames: ArrayLike<keyof StoreMap>;
 *  readonly version: number;
 *  close(): void;
 *  createObjectStore<T extends keyof StoreMap>(name: T, options?: IDBObjectStoreParameters): TypedIDBObjectStore<T, StoreMap>;
 *  deleteObjectStore(name: keyof StoreMap): void;
 *  transaction(storeNames: keyof StoreMap | Iterable<keyof StoreMap>, mode?: IDBTransactionMode, options?: IDBTransactionOptions): TypedIDBTransaction<StoreMap>;
 * }} TypedIDBDatabase
 */

/**
 * @typedef {{
 *  id: string;
 *  status: string;
 *  documents: {
 *      name: string;
 *      status: string;
 *  }[];
 * }} JobStoreItem
 */

/**
 * @typedef {{
 *  jobs: JobStoreItem
 * }} JobStoreMap
 */

/**
 * @typedef {{
 *  add(id: string, ...documents: string[]): Promise<void>;
 *  clear(): Promise<void>;
 *  get(id: string): Promise<JobStoreItem>;
 *  remove(id: string): Promise<void>;
 *  update(id: string, data: JobStoreItem): Promise<void>;
 * }} JobStoreApi
 */

/**
 * Wraps a Promise around an IDB request.
 * @template T Item being requested from the IndexedDB API.
 * @param {IDBRequest<T>} req An IndexedDB request.
 * @returns {Promise<T>} A promise for the given IDB request.
 */
const promisifyIdbRequest = req => new Promise((resolve, reject) => {
    req.addEventListener('success', () => resolve(req.result));
    req.addEventListener('error', () => reject(req.error));
});

/**
 * @param {string} [storeName] Name of the document store to use
 * @returns {[JobStoreItem[] | null, JobStoreApi]}
 */
export default function useJobsStore(storeName = 'jobs') {
    const [db, setDb] = useState(/** @type {TypedIDBDatabase<JobStoreMap>?} */ (null));
    const [jobs, setJobs] = useState(/** @type {JobStoreItem[]} */([]));

    useEffect(() => {
        if (db) return;

        const req = indexedDB.open(storeName);
        req.onupgradeneeded = () => {
            (/** @type {TypedIDBDatabase<JobStoreMap>} */ (req.result)).createObjectStore(storeName, {
                keyPath: 'id'
            });
        };

        promisifyIdbRequest(req).then(async (/** @type {TypedIDBDatabase<JobStoreMap>} */ db) => {
            const jobs = await promisifyIdbRequest(
                db.transaction([storeName], 'readonly').objectStore(storeName).getAll());

            setDb(db);
            setJobs(jobs);
        });

        return () => (db && db.close());
    }, [db, storeName]);

    return [db ? jobs : db, {
        async add(id, ...documents) {
            if (!db) throw new Error('Job store not open');

            const objStore = db.transaction([storeName], 'readwrite').objectStore(storeName);
            const newJob = {
                id,
                status: 'waiting',
                documents: documents.reduce((prev, name) => ([ ...prev, {
                    name, status: ''
                }]), [])
            };

            await promisifyIdbRequest(objStore.add(newJob));
            setJobs([ ...jobs, newJob ]);
        },

        async clear() {
            if (!db) return;
            await promisifyIdbRequest(db.transaction([storeName], 'readwrite').objectStore(storeName).clear());
            setJobs([]);
        },

        get(id) {
            if (!db) throw new Error('Job store not open');
            return promisifyIdbRequest(db.transaction([storeName], 'readonly').objectStore(storeName).get(id));
        },

        async remove(id) {
            if (!db) throw new Error('Job store not open');
            await promisifyIdbRequest(db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id));
            setJobs(jobs.filter(({id: itemId}) => itemId !== id));
        },

        async update(id, newRecord) {
            if (!db) throw new Error('Job store not open');

            newRecord = { ...newRecord, id };
            await promisifyIdbRequest(db.transaction([storeName], 'readwrite').objectStore(storeName).put(newRecord));
            setJobs(jobs.map(record => record.id === id ? newRecord : record));
        }
    }];
}

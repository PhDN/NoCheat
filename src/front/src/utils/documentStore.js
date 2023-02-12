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
 *  document: Blob;
 *  id: number;
 *  name: string;
 * }} DocumentStoreItem
 */

/**
 * @typedef {{
 *  documents: DocumentStoreItem
 * }} DocumentStoreMap
 */

/**
 * @typedef {{
 *  add(...documents: (Blob | string)[]): Promise<void>;
 *  clear(): Promise<void>;
 *  remove(id: number): Promise<void>;
 * }} DocumentStoreApi
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
 * @returns {[DocumentStoreItem[] | null, DocumentStoreApi]}
 */
export default function useDocumentStore(storeName = 'documents') {
    const [db, setDb] = useState(/** @type {TypedIDBDatabase<DocumentStoreMap>?} */ (null));
    const [docs, setDocs] = useState(/** @type {DocumentStoreItem[]} */([]));

    useEffect(() => {
        if (db) return;

        const req = indexedDB.open(storeName);
        req.onupgradeneeded = () => {
            const objStore = (/** @type {TypedIDBDatabase<DocumentStoreMap>} */ (req.result)).createObjectStore(storeName, {
                keyPath: 'id',
                autoIncrement: true
            });
            objStore.createIndex('names', 'name');
        };

        promisifyIdbRequest(req).then(async (/** @type {TypedIDBDatabase<DocumentStoreMap>} */ db) => {
            const docs = await promisifyIdbRequest(
                db.transaction([storeName], 'readonly').objectStore(storeName).getAll());
            
            setDb(db);
            setDocs(docs);
        });

        return () => (db && db.close());
    }, [db, storeName]);

    /** @type {(x: unknown) => x is string} */
    function isString(x) {
        return typeof x == 'string' || x instanceof String;
    }

    return [db ? docs : db, {
        async add(...documents) {
            if (!db) throw new Error('Document store not open');

            let n = await promisifyIdbRequest(db.transaction([storeName], 'readonly').objectStore(storeName).count())

            let makeDocName = () => 'doc' + n++;

            const objStore = db.transaction([storeName], 'readwrite').objectStore(storeName);
            const newDocs = [ ...docs ], /** @type {Promise<IDBValidKey>[]} */ ids = [];

            let skip;
            documents.forEach((document, i) => {
                if (skip) {
                    skip = 0;
                    return;
                }

                const item = {
                    document: isString(document) ?
                        new Blob([document], { type: 'text/plain' }) :
                        document,
                    name: document instanceof File ?
                        document.name :
                        isString(documents[i+1]) ?
                        /** @type {string} */ ((skip = 1), documents[++i]) :
                        makeDocName()
                };
                newDocs.push(item);
                ids.push(promisifyIdbRequest(objStore.add(item)));
            });

            (await Promise.all(ids)).forEach((id, i) => {
                newDocs[docs.length + i].id = id;
            });

            setDocs(newDocs);
            objStore.transaction.commit();
        },

        async clear() {
            if (!db) return;
            await promisifyIdbRequest(db.transaction([storeName], 'readwrite').objectStore(storeName).clear());
            setDocs([]);
        },

        async remove(id) {
            if (!db) throw new Error('Document store not open');
            await promisifyIdbRequest(db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id));
            setDocs(docs.filter(({id: itemId}) => itemId !== id));
        }
    }];
}

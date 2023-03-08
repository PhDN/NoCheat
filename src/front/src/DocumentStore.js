import { createContext } from "react";

/**
 * Context for obtaining the API for manipulating items in the document store.
 * 
 * @type {React.Context<[
 *      import('./utils/documentStore').DocumentStoreItem[]?,
 *      import('./utils/documentStore').DocumentStoreApi
 * ]>}
 */
const DocumentStore = createContext();
export default DocumentStore;

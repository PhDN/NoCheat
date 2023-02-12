import { createContext } from "react";

/**
 * @type {React.Context<[
 *      import('./utils/documentStore').DocumentStoreItem[]?,
 *      import('./utils/documentStore').DocumentStoreApi
 * ]>}
 */
const DocumentStore = createContext();
export default DocumentStore;

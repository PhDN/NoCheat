import { createContext } from "react";

/**
 * Context for obtaining the API for manipulating items in the job store.
 * 
 * @type {React.Context<[
 *      import('./utils/jobsStore').JobStoreItem[]?,
 *      import('./utils/jobsStore').JobStoreApi
 * ]>}
 */
const JobStore = createContext();
export default JobStore;

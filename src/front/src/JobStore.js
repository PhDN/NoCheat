import { createContext } from "react";

/**
 * @type {React.Context<[
 *      import('./utils/jobsStore').JobStoreItem[]?,
 *      import('./utils/jobsStore').JobStoreApi
 * ]>}
 */
const JobStore = createContext();
export default JobStore;

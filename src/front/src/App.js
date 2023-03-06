import { useState } from 'react';
import DocumentsForm from './DocumentsForm';
import DocumentStore from './DocumentStore';
import EditModal from './EditModal';
import IconButton from './IconButton';
import JobStore from './JobStore';

import useDocumentStore from './utils/documentStore';
import useJobsStore from './utils/jobsStore';

import JobsList from './JobsList';

import './App.css';

export default function App() {
    const [editing, setEditing] = useState(/** @type {number?} */ (null));
    function openEditModal(/** @type {number} */ id) {
        if (editing) return;
        setEditing(id);
    }

    return <DocumentStore.Provider value={useDocumentStore()}>
        <JobStore.Provider value={useJobsStore()}>
            <div className="App">
                <nav>
                    <span>NoCheat</span>
                    <IconButton type="info" title="Information" width={40} />
                    <IconButton type="help" title="FAQ" width={40} />
                </nav>
                <main>
                    <DocumentsForm openEditModal={openEditModal} />
                    <JobsList />
                    {editing !== null && <EditModal id={editing} close={setEditing.bind(null, null)} />}
                </main>
                <footer>&#169; 2023 | NoCheat Group</footer>
            </div>
        </JobStore.Provider>
    </DocumentStore.Provider>;
}

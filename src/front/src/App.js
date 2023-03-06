import { useState } from 'react';
import DocumentStore from './DocumentStore';
import DocumentsForm from './DocumentsForm';
import EditModal from './EditModal';
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
                <h1>NoCheat</h1>
                </nav>
                <main>
                    <h2>Our powerful model can detect AI generated texts.</h2>
                    <p>Check credibility of a text by uploading a file below or adding text to our editor using the add button on right.</p>
                    <DocumentsForm openEditModal={openEditModal} />
                    <JobsList />
                    {editing !== null && <EditModal id={editing} close={setEditing.bind(null, null)} />}
                </main>
                <footer>&#169; 2023 | NoCheat Group</footer>
            </div>
        </JobStore.Provider>
    </DocumentStore.Provider>;
}

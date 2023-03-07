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
                    <span><h1>NoCheat</h1></span>
                    <IconButton type="info" title="Information" width={40} />
                    <IconButton type="help" title="FAQ" width={40} />
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

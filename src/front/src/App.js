import { useState } from 'react';
import ContentModal from './ContentModal';
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
    const [editing, setEditing] = useState(/** @type {number?} */(null));
    const [gettingContent, setGettingContent] = useState(false);
    const [content, setContent] = useState(/** @type {string?} */(null));

    function openEditModal(/** @type {number} */ id) {
        if (editing) return;
        setEditing(id);
    }

    async function openContentModal(url) {
        setGettingContent(true);
        const response = await fetch(url);
        if (response.status >= 200 && response.status < 400) {
            setContent(await response.text());
        }
        setGettingContent(false);
    }

    return <DocumentStore.Provider value={useDocumentStore()}>
        <JobStore.Provider value={useJobsStore()}>
            <div className="App">
                <nav>
                    <span><h1>NoCheat</h1></span>
                    <IconButton
                        disabled={gettingContent}
                        type="info"
                        title="Instructions"
                        width={40}
                        onClick={openContentModal.bind(null, 'instructions.md')} />
                    <IconButton
                        disabled={gettingContent}
                        type="help"
                        title="FAQ"
                        width={40}
                        onClick={openContentModal.bind(null, 'faq.md')} />
                </nav>
                <main>
                    <h2>Our powerful model can detect AI generated texts.</h2>
                    <p>Check credibility of a text by uploading a file below or adding text to our editor using the add button on right.</p>
                    <DocumentsForm openEditModal={openEditModal} />
                    <JobsList />
                    {editing !== null && <EditModal id={editing} close={setEditing.bind(null, null)} />}
                    {content !== null && <ContentModal close={setContent.bind(null, null)} content={content} />}
                </main>
                <footer>&#169; 2023 | NoCheat Group</footer>
            </div>
        </JobStore.Provider>
    </DocumentStore.Provider>;
}

import { useState } from 'react';
import DocumentsForm from './DocumentsForm';
import EditModal from './EditModal';
import useDocumentStore from './utils/documentStore';

import './App.css';

export default function App() {
    const [editing, setEditing] = useState(/** @type {number?} */ (null));
    const [docs, docsApi] = useDocumentStore();

    function openEditModal(/** @type {number} */ id) {
        if (editing) return;
        setEditing(id);
    }

    return <div className="App">
        <nav>NoCheat</nav>
        <main>
            <DocumentsForm docs={docs} docsApi={docsApi} openEditModal={openEditModal} />
            {editing !== null && <EditModal docs={docs} docsApi={docsApi} id={editing} close={setEditing.bind(null, null)} />}
        </main>
        <footer>&#169; 2023 | NoCheat Group</footer>
    </div>;
}

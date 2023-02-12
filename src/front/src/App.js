import { useState } from 'react';
import DocumentsForm from './DocumentsForm';
import EditModal from './EditModal';

import './App.css';

export default function App() {
    const [editing, setEditing] = useState(/** @type {number?} */ ( null));

    function openEditModal(/** @type {number} */ id) {
        if (editing) return;
        setEditing(id);
    }

    return <div className="App">
        <nav>NoCheat</nav>
        <main>
            <DocumentsForm openEditModal={openEditModal} />
            {editing !== null && <EditModal id={editing} close={setEditing.bind(null, null)} />}
        </main>
        <footer>&#169; 2023 | NoCheat Group</footer>
    </div>;
}

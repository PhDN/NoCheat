import { useEffect } from 'react';

import './JobItem.css';

/**
 * @param {{
 *  documents: { name: string; status: string }[];
 *  id: string;
 *  remove(): Promise<void>;
 *  status: string;
 *  update(data: import('./utils/jobsStore.js').JobStoreItem): Promise<void>;
 * }} props
 */
export default function JobItem({ id, documents, remove, status, update }) {
    useEffect(() => {
        if (status !== 'waiting') return;

        fetch(`/api/job/${id}/query`).then(async response => {
            const { data: { status: newStatus } } = await response.json();
            if (status !== newStatus && newStatus !== 'complete')
                return await update({ status: newStatus, documents });

            response = await fetch(`/api/job/${id}`);
            const { data: rec } = await response.json();
            update(rec);
        });
    }, [ status ]);

    return <div className={`JobItem ${status}`}>
        <div className="banner">
            Job {id}
            {status === 'waiting' ?
                <button>Cancel</button> :
                <button onClick={remove}>Delete</button>}
        </div>
        <ul>{documents.map(({ name, status }, index) =>
            <li key={index}><em>{name}</em>{status && `: ${status}`}</li>
        )}</ul>
    </div>;
}
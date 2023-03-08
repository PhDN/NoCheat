import { useEffect } from 'react';
import IconButton from './IconButton';

import './JobItem.css';

/**
 * Component for displaying a singular job in the saved jobs list.
 * 
 * `JobsList` must provide the following properties to this component:
 * - `documents` - a list of documents and their associated statuses.
 * - `id` - the job ID to track & query the status of.
 * - `status` - the initial status of this job.
 * - `update` - a callback to update this job's status.
 * 
 * @param {{
 *  documents: { name: string; status: string }[];
 *  id: string;
 *  remove(): Promise<void>;
 *  status: string;
 *  update(data: import('./utils/jobsStore.js').JobStoreItem): Promise<void>;
 * }} props
 */
export default function JobItem({ documents, id, remove, status, update }) {
    let removed = false;

    useEffect(() => {
        if (status !== 'waiting') return;

        fetch(`/api/job/${id}/query`).then(async response => {
            const { data: { status: newStatus } } = await response.json();
            if (removed) return;
            if (status !== newStatus && newStatus !== 'complete')
                return await update({ status: newStatus, documents });

            response = await fetch(`/api/job/${id}`);
            const { data: rec } = await response.json();
            if (removed || response.status === 410) return;
            update(rec);
        });
    }, [ documents, id, removed, status, update ]);

    return <div className={`JobItem ${status}`}>
        <div className="banner">
            Job {id}
            <IconButton
                type="delete"
                title={status === 'waiting' ? 'Cancel' : 'Delete'}
                width={32}
                onClick={status === 'waiting' ? () => {
                    removed = true;
                    fetch(`/api/job/${id}`, { method: 'DELETE' });
                    remove();
                } : remove} />
        </div>
        <ul>{documents.map(({ name, status }, index) =>
            <li key={index}><em>{name}</em>{status && `: ${status}`}</li>
        )}</ul>
    </div>;
}

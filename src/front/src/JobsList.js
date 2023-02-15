import { useContext } from 'react';
import JobItem from './JobItem';
import JobStore from './JobStore';

import './JobsList.css';

export default function JobsList() {
    const [ jobs, { remove, update } ] = useContext(JobStore);

    return <div className='JobsList'>
        {jobs?.map(({id, documents, status}) => <JobItem
            key={id}
            documents={documents}
            id={id}
            status={status}
            remove={remove.bind(null, id)}
            update={update.bind(null, id)} />) || false}
    </div>;
}

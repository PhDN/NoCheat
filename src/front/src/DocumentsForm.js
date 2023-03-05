import { useContext, useState } from "react";
import DocumentItem from "./DocumentItem";
import DocumentStore from "./DocumentStore";
import JobStore from "./JobStore";

import './DocumentsForm.css';
import del from './delete.svg';
import _new from './new.svg';
import send from './send.svg';

/**
 * @param {{ openEditModal(id: number): Promise<void>; }} props
 */
export default function DocumentsForm({ openEditModal }) {
    const [docs, { add, clear, remove, update }] = useContext(DocumentStore);
    const [, { add: addJob }] = useContext(JobStore);
    const [id] = useState(Math.random().toString(16).substring(2));
    const [loading, setLoading] = useState(false);

    return <form
        className={`DocumentsForm${docs?.length ? ' filled' : ''}`}
        onSubmit={async event => {
            event.preventDefault();

            const formData = new FormData();
            for (const { document, name } of docs)
                formData.append('files', document, name);

            setLoading(true);
            try {
                const resp = await fetch('/api/submit', { method: 'POST', body: formData });
                const {status, job = undefined, message = undefined} = await resp.json();

                if (status !== 200)
                    throw new Error(`${status}: ${message}`);

                addJob(job, ...docs.map(({ name }) => name));
                await clear();
            } catch (e) {
                window.alert(`Error submitting documents:\n${e}`)
            }
            setLoading(false);
        }}>
        {docs?.map(({name, document, id}) =>
            <DocumentItem
                key={id}
                name={name}
                document={document}
                openEditModal={openEditModal.bind(null, id)}
                remove={remove.bind(null, id)}
                update={update.bind(null, id, document)} />)}
        <label htmlFor={`file-${id}`}>Insert files to submit here</label>
        <input
            accept=".pdf,application/pdf,application/x-pdf,.txt,text/plain,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,application/msword,.odt,application/vnd.oasis.opendocument.text"
            id={`file-${id}`}
            disabled={loading}
            multiple
            name='files'
            type='file'
            onInput={event => {
                event.preventDefault();
                event.stopPropagation();
                add(...event.target.files);
            }} />
        <span />
        <div className="buttons">
            <button className="add" title="Add" disabled={loading} onClick={event => {
                event.preventDefault();
                openEditModal(-1);
            }}><img src={_new} alt="Add" height={24} /></button>
            {docs && docs.length > 0 && <>
                <button className="clear" title="Clear" disabled={loading} onClick={event => {
                    event.preventDefault();
                    if (window.confirm('Are you sure you want to clear this document submission?'))
                        clear();
                }}><img src={del} alt="Clear" height={24} /></button>
                <button title="Submit" className="submit" disabled={loading}><img src={send} alt="Submit" height={24} /></button>
            </>}
        </div>
    </form>;
}

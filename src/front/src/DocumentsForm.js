import { useContext, useState } from "react";
import DocumentItem from "./DocumentItem";
import DocumentStore from "./DocumentStore";

import './DocumentsForm.css';
import del from './delete.svg';
import _new from './new.svg';
import send from './send.svg';

/**
 * @param {{ openEditModal(id: number): Promise<void>; }} props
 */
export default function DocumentsForm({ openEditModal }) {
    const [docs, { add, clear, remove, update }] = useContext(DocumentStore);
    const [id] = useState(Math.random().toString(16).substring(2));

    return <form
        className={`DocumentsForm${docs?.length ? ' filled' : ''}`}
        onSubmit={event => {
            event.preventDefault();

            const formData = new FormData();
            for (const { document, name } of docs)
                formData.append('files', document, name);

            fetch('/api/submit', { method: 'POST', body: formData });
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
            accept=".pdf,application/pdf,application/x-pdf,.md,.markdown,.mdown,.markdn,text/markdown,.txt,text/plain"
            id={`file-${id}`}
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
            <button className="add" title="Add" onClick={event => {
                event.preventDefault();
                openEditModal(-1);
            }}><img src={_new} alt="Add" height={24} /></button>
            {docs && docs.length > 0 && <>
                <button className="clear" title="Clear" onClick={event => {
                    event.preventDefault();
                    if (window.confirm('Are you sure you want to clear this document submission?'))
                        clear();
                }}><img src={del} alt="Clear" height={24} /></button>
                <button title="Submit" className="submit"><img src={send} alt="Submit" height={24} /></button>
            </>}
        </div>
    </form>;
}

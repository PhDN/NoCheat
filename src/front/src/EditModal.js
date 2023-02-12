import { useEffect, useRef, useState } from 'react';
import useDocumentStore from './utils/documentStore';

import './EditModal.css';
import del from './delete.svg';
import save from './save.svg';

/**
 * @param {{ id: number; close(): void; }} props
 */
export default function EditModal({ close, id }) {
    const [docs, { get, update }] = useDocumentStore();
    const [mimeType, setMimeType] = useState(/** @type {string?} */ (null));
    const [text, setText] = useState(/** @type {string?} */ (null));
    const [title, setTitle] = useState(/** @type {string?} */ (null));
    const [titleWidth, setTitleWidth] = useState(0);
    const [confirm, setConfirm] = useState(false);

    const span = useRef(/** @type {HTMLSpanElement} */ (null));
    useEffect(() => {
        if (!docs || text !== null) return;
        get(id).then(async ({document, name}) => {
            const text = await document.text();

            setMimeType(document.type);
            setText(text);
            setTitle(name);

            span.current.textContent = name;
            setTitleWidth(span.current.offsetWidth + 1);
        });
    }, [ docs, get, id, text ]);

    return <div className='EditModal'>
        <button className="exit" onClick={() => {
            if (!confirm || window.confirm('Are you sure you want to leave without saving your changes?'))
                close();
        }}><img src={del} alt="Exit" height={24} /></button>
        {confirm && <button className="save" onClick={async () => {
            await update(id, new Blob([text], { type: mimeType }), title);
            close();
        }}><img src={save} alt="Save" height={24} /></button>}
        <div>
            Editing <input type="text" value={title ?? ''} disabled={text === null} onInput={event => {
                const span = event.target.nextElementSibling;
                span.textContent = event.target.value;
                setTitle(event.target.value);
                setTitleWidth(span.offsetWidth + 1);
                setConfirm(true);
            }} style={{ width: titleWidth || 'fit-content' }} />
            {confirm && '*'}
            <span ref={span}>{title}</span>
        </div>
        <textarea onInput={event => {
            setText(event.target.value);
            setConfirm(true);
        }} disabled={text === null} value={text ?? ''} />
    </div>;
}

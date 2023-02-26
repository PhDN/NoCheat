import { useContext, useEffect, useRef, useState } from 'react';
import DocumentStore from './DocumentStore';

import './EditModal.css';
import del from './delete.svg';
import save from './save.svg';

/**
 * @param {{ id: number; close(): void; }} props
 */
export default function EditModal({ close, id }) {
    const [docs, { add, get, update }] = useContext(DocumentStore);
    const [mimeType, setMimeType] = useState(/** @type {string?} */ (null));
    const [text, setText] = useState(/** @type {string?} */ (null));
    const [title, setTitle] = useState(/** @type {string?} */ (null));
    const [titleWidth, setTitleWidth] = useState(0);
    const [confirm, setConfirm] = useState(false);
    const [wordWrap, setWordWrap] = useState(Number(localStorage.getItem('prefers-word-wrap')));

    const span = useRef(/** @type {HTMLSpanElement} */ (null));
    useEffect(() => {
        if (!docs || text !== null) return;
        
        if (id < 0) {
            setMimeType('text/plain');
            setText('');
            setTitle('Untitled');
            setConfirm(true);
        } else get(id).then(async ({document, name}) => {
            const text = await document.text();

            setMimeType(document.type);
            setText(text);
            setTitle(name);

            span.current.textContent = name;
            setTitleWidth(span.current.offsetWidth + 1);
        });
    }, [ docs, get, id, text ]);

    const titleInput = useRef(/** @type {HTMLInputElement} */ (null));

    return <div className='EditModal'>
        <button className="exit" title="Exit" onClick={() => {
            if (!confirm || window.confirm('Are you sure you want to leave without saving your changes?'))
                close();
        }}><img src={del} alt="Exit" height={24} /></button>
        {confirm && <button className="save" title="Save" onClick={async () => {
            if (!title.length) {
                titleInput.current.focus();
                return;
            }

            await (id < 0 ? add(text, title) : update(id < 0 ? void 0 : id, new Blob([text], { type: mimeType }), title));
            close();
        }}><img src={save} alt="Save" height={24} /></button>}
        <div>
            Editing <input type="text" value={title ?? ''} disabled={text === null} onInput={event => {
                const span = event.target.nextElementSibling;
                span.textContent = event.target.value;
                setTitle(event.target.value);
                setTitleWidth(span.offsetWidth + 1);
                setConfirm(true);
            }} style={{ width: titleWidth || 'fit-content' }} ref={titleInput} />
            {confirm && '*'}
            <span ref={span}>{title}</span>
        </div>
        <textarea className={wordWrap ? 'word-wrap' : ''} onInput={event => {
            setText(event.target.value);
            setConfirm(true);
        }} disabled={text === null} value={text ?? ''} />
        <div className="settings">
            <input type="checkbox" defaultChecked={!!wordWrap} id="word-wrap" onInput={() => {
                localStorage.setItem('prefers-word-wrap', Number(!wordWrap));
                setWordWrap(!wordWrap);
            }} />
            <label htmlFor="word-wrap">Word wrap</label>
        </div>
    </div>;
}

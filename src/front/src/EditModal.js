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
    const [tabSize, setTabSize] = useState(Number(localStorage.getItem('preferred-tab-size') ?? 4));

    const minTabSize = 2, maxTabSize = 8;

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

    const setTabSizeValue = (value) => {
        value = Math.max(minTabSize, Math.min(Number(value), maxTabSize));
        localStorage.setItem('preferred-tab-size', value);
        setTabSize(value);
    };

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
        <textarea
            className={wordWrap ? 'word-wrap' : ''}
            disabled={text === null}
            style={{ tabSize, MozTabSize: tabSize }}
            value={text ?? ''}
            onInput={event => {
                setText(event.target.value);
                setConfirm(true);
            }} />
        <div className="settings">
            <label htmlFor="word-wrap">Word wrap</label>
            <input type="checkbox" defaultChecked={!!wordWrap} id="word-wrap" onInput={() => {
                localStorage.setItem('prefers-word-wrap', Number(!wordWrap));
                setWordWrap(!wordWrap);
            }} />

            <label htmlFor="tab-size">Tab size</label>
            <input type="number" min={minTabSize} max={maxTabSize} value={tabSize} id="tab-size" onInput={(event) => {
                setTabSizeValue(event.target.value);
            }} onKeyDown={(event) => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Tab') return;
                event.preventDefault();

                if (event.key === 'ArrowLeft') {
                    setTabSizeValue(+event.target.value - 1);
                } else if (event.key === 'ArrowRight') {
                    setTabSizeValue(+event.target.value + 1);
                } else if (/^[0-9]$/.test(event.key)) {
                    setTabSizeValue(event.key);
                }
            }} />
        </div>
    </div>;
}

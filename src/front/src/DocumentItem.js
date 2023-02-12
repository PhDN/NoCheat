import {Document, Page, pdfjs} from 'react-pdf';

import './DocumentItem.css';
import del from './delete.svg';
import edit from './edit.svg';

pdfjs.GlobalWorkerOptions.workerSrc= `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/** @type {(document: Blob) => boolean} */
const isPdf = document => ['application/pdf', 'application/x-pdf'].includes(document.type);

/**
 * @param {{
 *      name: string;
 *      document: Blob;
 *      remove(): Promise<void>;
 *      openEditModal(): Promise<void>;
 *      update(name: string): Promise<void>;
 *  }} props
 */
export default function DocumentItem({ name, document, openEditModal, remove, update }) {
    return <div className="DocumentItem">
        {isPdf(document) &&
            <Document file={document} onLoadError={console.error.bind(console)}>
                <Page pageNumber={1} width={224} renderAnnotationLayer={false} renderTextLayer={false} renderInteractiveForms={false} />
            </Document>}
        <div title={name}>{name}</div>
        <span className="edit" title="Edit" onClick={() => {
            console.log(isPdf(document));
            if (isPdf(document)) {
                let newName = window.prompt(`Change name of ${name}:`, name);
                newName && update(newName);
            } else
                openEditModal();
        }}>
            <img src={edit} alt="Edit" width={14} />
        </span>
        <span className="del"  title="Delete" onClick={remove}>
            <img src={del} alt="Del" width={14} />
        </span>
    </div>;
}

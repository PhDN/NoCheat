import {useEffect, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import "./DocumentPreview.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/** @type {(document: Blob) => boolean} */
export const isPdf = document => ['application/pdf', 'application/x-pdf'].includes(document.type);

const plainTextSet = new Set([
    'bsh',
    'csh',
    'ecmascript',
    'javascript',
    'json',
    'lisp',
    'rtf',
    'sh',
    'tex',
    'yaml',
]);

/** @type {(document: Blob) => boolean} */
export const isPlainText = document => document.type.startsWith('text/') ||
    /\+(?:xml|json)$/.test(document.type) ||
    (document.type.startsWith('application/') &&
        plainTextSet.has(document.type.match(/^application\/(?:x-)?(.+?)$/)[1]));

/**
 * @param {{ document: Blob; }} props
 */
export default function DocumentPreview({ document }) {
    const [text, setText] = useState(isPlainText(document) ? null : (document.type || 'unknown'));

    useEffect(() => {
        if (text === null && isPlainText(document)) document.text().then(text => setText(text.slice(0, 2000)));
    }, [document, text]);

    return isPdf(document) ? <Document file={document} onLoadError={console.error.bind(console)}>
        <Page pageNumber={1} width={224} renderAnnotationLayer={false} renderTextLayer={false} renderInteractiveForms={false} />
    </Document> : <div className={`DocumentPreview${isPlainText(document) ? '' : ' center'}`}>
        {text}
    </div>;
}

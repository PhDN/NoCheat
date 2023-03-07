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
    'xml',
    'yaml',
]), notPlainTextSet = new Set([
    'audiosoft-intra'
]);

/** @type {(document: Blob) => boolean} */
export const isPlainText = ({type}) =>
    /\+(?:xml|json)$/.test(type) ||
    (type.startsWith('text/') &&
        !notPlainTextSet.has(type.match(/^text\/(?:x-)?(.+?)$/)[1])) ||
    (type.startsWith('application/') &&
        plainTextSet.has(type.match(/^application\/(?:x-)?(.+?)$/)[1]));

/**
 * Component for previewing a given document.
 * 
 * If the document is a PDF or a text file, a preview will be displayed. Otherwise, the MIME type of the file is shown.
 * 
 * @param {{ document: Blob; }} props
 */
export default function DocumentPreview({ document }) {
    const [text, setText] = useState(isPlainText(document) ? null : (document.type || 'unknown'));

    useEffect(() => {
        if (text === null && isPlainText(document)) document.text().then(text => setText(text.slice(0, 2000)));
    }, [document, text]);

    return isPdf(document) ? <Document file={document} onLoadError={console.error.bind(console)}>
        <Page
            pageNumber={1}
            width={224}
            renderAnnotationLayer={false}
            renderInteractiveForms={false}
            renderTextLayer={false} />
    </Document> : <div className={`DocumentPreview${isPlainText(document) ? '' : ' center'}`}>
        {text}
    </div>;
}

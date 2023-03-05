import {useEffect, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import "./DocumentPreview.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/** @type {(document: Blob) => boolean} */
const isPdf = document => ['application/pdf', 'application/x-pdf'].includes(document.type);

/** @type {(document: Blob) => boolean} */
export const isPlainText = document => document.type.startsWith('text/')  || document.type === 'application/json';

/**
 * @param {{ document: Blob; }} props
 */
export default function DocumentPreview({ document }) {
    const [text, setText] = useState(
        isPlainText(document) ? false : document.type);

    useEffect(() => {
        if (!text) document.text().then(text => setText(text.slice(0, 2000)));
    }, [document, text]);

    return isPdf(document) ? <Document file={document} onLoadError={console.error.bind(console)}>
        <Page pageNumber={1} width={224} renderAnnotationLayer={false} renderTextLayer={false} renderInteractiveForms={false} />
    </Document> : <div className={`DocumentPreview${isPlainText(document) ? '' : ' center'}`}>
        {text}
    </div>;
}

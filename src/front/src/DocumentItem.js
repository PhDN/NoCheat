import { useState } from 'react';
import DocumentPreview, {isPlainText} from './DocumentPreview';
import IconButton from './IconButton';

import './DocumentItem.css';

/**
 * Component which displays a single document in the `DocumentsForm`.
 * 
 * `DocumentsForm` must provide the following properties to this component:
 * - `name` - the name of the document.
 * - `document` - the document contents as a File/Blob.
 * - `remove` - a callback to remove the document this item represents from the form.
 * - `openEditModal` - a callback to edit this document's contents if it's a text file.
 * - `update` - a callback to update this document's name; used in lieu of editing when the document isn't a text file.
 * 
 * @param {{
 *      name: string;
 *      document: Blob;
 *      remove(): Promise<void>;
 *      openEditModal(): Promise<void>;
 *      update(name: string): Promise<void>;
 *  }} props
 */
export default function DocumentItem({ name, document, openEditModal, remove, update }) {
    const [isClosing, setClosing] = useState(false);

    return <div className="DocumentItem" style={isClosing ? { animationName: 'pop-out' } : {}}>
        <DocumentPreview document={document} />
        <div title={name}>{name}</div>
        <IconButton type="edit" title="Edit" width={24} disabled={isClosing} onClick={() => {
            if (isPlainText(document)) {
                openEditModal();
            } else {
                let newName = window.prompt(`Change name of ${name}:`, name);
                newName && update(newName);
            }
        }} />
        <IconButton type="delete" title="Delete" width={24} disabled={isClosing} onClick={() => {
            setClosing(true);
            setTimeout(remove, 250);
        }} />
    </div>;
}

import DocumentPreview, {isPlainText} from './DocumentPreview';
import IconButton from './IconButton';

import './DocumentItem.css';

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
        <DocumentPreview document={document} />
        <div title={name}>{name}</div>
        <IconButton type="edit" title="Edit" width={24} onClick={() => {
            if (isPlainText(document)) {
                openEditModal();
            } else {
                let newName = window.prompt(`Change name of ${name}:`, name);
                newName && update(newName);
            }
        }} />
        <IconButton type="delete" title="Delete"  width={24} onClick={remove} />
    </div>;
}

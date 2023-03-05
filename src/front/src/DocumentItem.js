import DocumentPreview, {isPlainText} from './DocumentPreview';

import './DocumentItem.css';
import del from './delete.svg';
import edit from './edit.svg';

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
        <span className="edit" title="Edit" onClick={() => {
            if (isPlainText(document)) {
                openEditModal();
            } else {
                let newName = window.prompt(`Change name of ${name}:`, name);
                newName && update(newName);
            }
        }}>
            <img src={edit} alt="Edit" width={14} />
        </span>
        <span className="del"  title="Delete" onClick={remove}>
            <img src={del} alt="Del" width={14} />
        </span>
    </div>;
}

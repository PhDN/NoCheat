import ReactMarkdown from 'react-markdown';
import Modal from './Modal';

import './ContentModal.css';
import IconButton from './IconButton';

/**
 * @param {{ content: string; close(): void; }}
 */
export default function ContentModal({ content, close }) {
    void close;
    return <Modal className="ContentModal">
        <div>
            <div className='header'>
                <IconButton type='delete' title='Close' width={40} onClick={close} style={{ float: 'right' }} />
            </div>
            <div className='content'>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    </Modal>;
}

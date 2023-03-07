import './Modal.css';

/**
 * @param {import('react').PropsWithChildren<{ className?: string; }>} props
 */
export default function Modal({ className, children }) {
    return <div className={`Modal${className !== undefined ? ' ' + className : ''}`}>
        {children}
    </div>;
}

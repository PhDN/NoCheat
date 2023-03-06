import del from './delete.svg';
import edit from './edit.svg';
import help from './help.svg';
import info from './info.svg';
import save from './save.svg';

import './IconButton.css';

const types = {
    delete: [ del,  '#f00', '#f44' ],
    edit:   [ edit, '#4b4', '#6c6' ],
    help:   [ help, '#f00', '#f44' ],
    info:   [ info, '#44f', '#66f' ],
    save:   [ save, '#44f', '#66f' ]
};

/**
 * @param {{
 *  onClick: import('react').MouseEventHandler;
 *  style: import('react').CSSProperties;
 *  title: string;
 *  type: keyof typeof types;
 *  width: number;
 * }} props
 */
export default function IconButton({ onClick, style, title, type, width }) {
    const [src, color, hoverColor] = types[type];
    const imgWidth = Math.round(width * 0.625);

    return <button className={`IconButton ${type}`} title={title} onClick={event => {
        for (let elem = event.target; (elem = elem.parentElement);) {
            if (elem.nodeName === 'FORM') {
                event.preventDefault();
                break;
            }
        }
        return onClick(event);
    }} style={{
        ...style,
        width: `${width}px`,
        height: `${width}px`,
        '--color': color,
        '--hover-color': hoverColor
    }}>
        <img src={src} alt={type[0].toUpperCase() + type.slice(1).toLowerCase()} width={imgWidth} />
    </button>;
}

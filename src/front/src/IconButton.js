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
 * Button component which can display one of various icons.
 * 
 * The following properties may be provided to this component:
 * - `disabled` - disallow clicking the button.
 * - `onClick` - callback to use when the button is clicked.
 * - `style` - additional CSS styles to apply to the button.
 * - `title` - Text to display when hovering over the button with the mouse.
 * 
 * The following properties *must* be provided to this component:
 * - `type` - What kind of button this is + what icon to display.
 * - `width` - Width of the button in [logical (CSS) pixels](https://www.w3.org/TR/CSS21/syndata.html#x39).
 * 
 * @param {{
 *  disabled?: boolean;
 *  onClick?: import('react').MouseEventHandler;
 *  style?: import('react').CSSProperties;
 *  title?: string;
 *  type: keyof typeof types;
 *  width: number;
 * }} props
 */
export default function IconButton({ disabled, onClick, style = {}, title, type, width }) {
    const [src, color, hoverColor] = types[type];
    const imgWidth = Math.round(width * 0.625);

    return <button className={`IconButton ${type}`} disabled={disabled} title={title} onClick={event => {
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

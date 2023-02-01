/**
 * @param {{ name: string; remove(): Promise<void>; }} props
 */
export default function DocumentItem({name, remove}) {
    return <div className="DocumentItem">
        <span>{name}</span>
        <button onClick={(event) => {
            event.preventDefault();
        }}>Edit</button>
        <button onClick={(event) => {
            event.preventDefault();
            remove();
        }}>Delete</button>
    </div>;
}

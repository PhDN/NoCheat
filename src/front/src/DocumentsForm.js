import DocumentItem from "./DocumentItem";
import useDocumentStore from "./utils/documentStore";

import './DocumentsForm.css';

export default function DocumentsForm() {
    const [docs, { add, remove }] = useDocumentStore();
    console.log(docs);

    return <form className="DocumentsForm">
        {docs?.map(({name, id}) => <>
            <DocumentItem name={name} remove={remove.bind(null, id)} />
        </>)}
        <input
            accept=".pdf,application/pdf,application/x-pdf,.md,.markdown,.mdown,.markdn,text/markdown,.txt,text/plain"
            multiple
            type="file"
            onInput={event => {
                console.log(...event.target.files);
                add(...event.target.files).then(() => console.log('complete!'));

                event.preventDefault();
                event.stopPropagation();
            }} />
        <button className="DocumentsForm-add" onClick={event => {
            event.preventDefault();
        }}>Add</button>
        {docs && docs.length > 0 && <button className="DocumentsForm-clear" onClick={event => {
            event.preventDefault();
        }}>Clear</button>}
        <input type="submit" value="Submit" className="DocumentsForm-submit" />
    </form>;
}

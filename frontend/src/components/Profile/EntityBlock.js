import {useState} from "react";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";
import {getAuthorFormatted, getType} from "./utils";
import NewEntity from "./NewEntity";


export default function EntityBlock({entity}) {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return <><div className={`book-cover${isOpen?" open":""}`}>
        <div className="book-header">
            <span className="entity-type">
                {getType(entity)}
            </span>
            <span className="book-title">{entity.title || "untitled"}</span>
            {!!entity.Pseudonym && <span className="book-author">by {getAuthorFormatted(entity)}</span>}
        </div>
        <div className="controls">
            <i className="fas fa-pen-nib" onClick={()=>setShowModal(true)} ></i>
            {isOpen && <i className="fas fa-book-open active" onClick={()=>setIsOpen(!isOpen)} ></i>}
            {!isOpen && <i className="fas fa-book" onClick={()=>setIsOpen(!isOpen)} ></i>}
        </div>
    </div>
    {isOpen && <div className="book-content">
        {entity.children.map((entity,idx) => <EntityBlock entity={entity} key={`entity-${entity.id}`} /> )}
        <NewEntity parentEntity={entity} />
    </div>}
    {showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <EntityForm onClose={() => setShowModal(false)} entity={entity}/>
        </Modal>
    )}
    </>
}
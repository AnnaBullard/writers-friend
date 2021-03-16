import {useState} from "react";
import {Link} from "react-router-dom";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";
import ConfirmDelete from "./ConfirmDelete";
import {getAuthorFormatted, getType} from "../Workshop/utils";


export default function EntityBlock({entity}) {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("edit");

    return <><div className={`book-cover`}>
        <div className="book-header">
            <span className="entity-type">
                {getType(entity)}
            </span>
            <span className="book-title">{entity.title || "untitled"}</span>
            {!!entity.Pseudonym && <span className="book-author">by {getAuthorFormatted(entity)}</span>}
        </div>
        <div className="controls">
            <i className="fas fa-eraser" onClick={()=>{
                    setModalType("delete")
                    setShowModal(true)
                    }} ></i>
            {(entity.typeId !== 1) && <>
                <i className="fas fa-pen-nib" onClick={()=>{
                    setModalType("edit")
                    setShowModal(true)
                    }} ></i>
                <Link to={`/workshop/${entity.id}`}><i className="fas fa-book"></i></Link>
            </>}
            {(entity.typeId === 1) && <>
                <Link to={`/scenes/${entity.id}`}><i className="fas fa-pen-nib"></i></Link>
                <Link to={`/story/${entity.id}`}><i className="fas fa-book"></i></Link>
            </>
            }
        </div>
    </div>
    {showModal && (
        <Modal onClose={() => setShowModal(false)}>
            {modalType==="edit" && <EntityForm onClose={() => setShowModal(false)} entity={entity}/>}
            {modalType==="delete" && <ConfirmDelete onClose={() => setShowModal(false)} entity={entity}/>}
        </Modal>
    )}
    </>
}
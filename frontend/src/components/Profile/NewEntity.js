import {useState} from "react";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";

export default function NewEntity ({parentEntity}) {
    const [showModal, setShowModal] = useState(false);
    console.log("parentEntity",parentEntity)
    let newEntityStart = {
        parentId: parentEntity?parentEntity.id:0,
        typeId: parentEntity?parentEntity.typeId-1:1
    }

    return <>
    <div className="add-entity" onClick={()=>setShowModal(true)} ><i className="fas fa-plus"></i></div>
    {showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <EntityForm onClose={() => setShowModal(false)} entity={newEntityStart}/>
        </Modal>
    )}
    </>
}
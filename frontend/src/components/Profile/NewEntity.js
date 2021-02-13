import {useState} from "react";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";

export default function NewEntity ({parentEntity}) {
    const [showModal, setShowModal] = useState(false);

    let newEntityStart = {
        parentId: parentEntity?parentEntity.id:null,
        typeId: parentEntity?parentEntity.typeId-1:undefined
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
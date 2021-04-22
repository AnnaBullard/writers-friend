import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {getPath} from "../Workshop/utils";
import EntityForm from "../EntitiesTiles/EntityForm";
import ConfirmDelete from "../EntitiesTiles/ConfirmDelete";
import {Modal} from '../../context/Modal';

export default function EntityDetails({entity}) {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("edit");
    const [author, setAuthor] = useState("anonymous");
    const [tree, setTree] = useState([]);
    
    const entityTypes = [null, "chapter/story", "book", "book series", "world"]

    const pseudonyms = useSelector(state => state.pseudonyms)
    const entities = useSelector(state => state.entities)

    useEffect(()=>{
        let findAuthor = (entity && entity.pseudonymId)?pseudonyms.find(name => name.id === entity.pseudonymId):null;
        if (findAuthor) {
            setAuthor(`${findAuthor.firstName?findAuthor.firstName:""}${findAuthor.middleName?" "+findAuthor.middleName:""}${findAuthor.lastName?" "+findAuthor.lastName:""}`)
        } else {
            setAuthor("anonymous")
        }
    },[entity, pseudonyms])
    
    useEffect(()=>{
        if (entities.length && entity && entity.parentId) {
            let path = getPath(entity.id, entities)
            path.pop();
            setTree(path.reverse());
        } else {
            setTree([]);
        }
    },[entity, entities])

    if (!entity) return <div className="entity-details">
        Select a work to see details
    </div>

    return !!entity && <>
        <div className="entity-details">
            <div className="book-type">{entity.typeId > 1?`${entityTypes[entity.typeId]}`:(entity.parentId && tree.length && tree[0].typeId===2)?"chapter":"story"}</div>
            <div className="book-title">{entity.title?`"${entity.title}"`:"untitiled"}</div>
            <div className="book-author">{`by ${author}`}</div>
            <div className="controls">
                <i className="fas fa-eraser" onClick={()=>{
                    setModalType("delete")
                    setShowModal(true)
                    }} ></i>
                <i className="fas fa-pen-nib" onClick={()=>{
                    setModalType("edit")
                    setShowModal(true)
                    }} ></i>
                {(entity.typeId === 1) && <Link to={`/scenes/${entity.id}`}><i className="fas fa-signature"></i></Link>}
                <Link to={`/workshop/${entity.id}`}><i className="fas fa-book"></i></Link>
            </div>
            {tree.length>0 && <div className="parents-tree">
                <span>Part of</span>
                <ul>
                    {tree.map(item => {
                        return <li key={`parent-tree-item-${item.id}`}>
                            <span>{entityTypes[item.typeId]}</span>
                            <span>{item.title}</span>
                        </li>
                    })}
                </ul>
            </div>}
            <div className="book-description">
                    <span>Description</span>
                    <div>{entity.description}</div>
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
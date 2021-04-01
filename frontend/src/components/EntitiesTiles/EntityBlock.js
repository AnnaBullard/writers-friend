import {useState, useContext, useRef} from "react";
import {Link} from "react-router-dom";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";
import ConfirmDelete from "./ConfirmDelete";
import {getAuthorFormatted, getType} from "../Workshop/utils";
import {useDrop, useDrag} from "react-dnd";
import ItemTypes from "../Workshop/itemTypes";
import {WorkshopContext} from "../Workshop";

export default function EntityBlock({entity, idx}) {
    const ref = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("edit");

    const moveEntity = useContext(WorkshopContext);

    const [{isOver}, drop] = useDrop(() => ({
        accept: [ItemTypes.ENTITY_TILE, ItemTypes.ENTITY_BRANCH],
        drop: (item, monitor) => {
            console.log("drop")
        },
        hover: (item, monitor) => {
            // if (item.id !== idx){
            //     moveEntity({id: item.id, order:idx})
            //     let i = item.order
            //     let e = idx
            //     idx = i
            //     item.order = e 
            // }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const [{isDragging}, drag, dragPreview] = useDrag(()=>({
        item: {
            id: entity.id,
            parentId: entity.parentId,
            typeId: entity.typeId,
            type: ItemTypes.ENTITY_TILE,
            order: idx
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }))
    
    drag(drop(ref));

    return <>
        {isDragging ? 
        <div ref={dragPreview} className="preview-tile" ></div> 
        : ( <div className={`book-cover`} ref={ref} style={{border: isOver?"2px solid red":""}}>
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
        )}
        {showModal && (
            <Modal onClose={() => setShowModal(false)}>
                {modalType==="edit" && <EntityForm onClose={() => setShowModal(false)} entity={entity}/>}
                {modalType==="delete" && <ConfirmDelete onClose={() => setShowModal(false)} entity={entity}/>}
            </Modal>
        )}
    </>
}
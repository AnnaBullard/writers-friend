import {useState,useContext, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";
import ConfirmDelete from "./ConfirmDelete";
import {getAuthorFormatted, getType} from "../Workshop/utils";
import {useDrop, useDrag} from "react-dnd";
import ItemTypes from "../Workshop/itemTypes";
import {WorkshopContext} from "../Workshop";

export default function EntityBlock({entity, prev, setPrev}) {
    const ref = useRef(null);
    const orderRef = useRef();

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("edit");

    const moveEntity = useContext(WorkshopContext);

    const [{isOver}, drop] = useDrop(() => ({
        accept: [ItemTypes.ENTITY_TILE, ItemTypes.ENTITY_BRANCH],
        drop: (item, monitor) => {
            console.log("whatever")
        },
        hover: (item, monitor) => {
            console.log(prev, entity.id)
            if(prev===undefined || prev !== entity.id) {
                console.log(item)
                console.log(entity)
            }
            setPrev(entity.id)
            console.log("item.parentId", item.parentId, "entity.parentId", entity.parentId, 
            "item.order", item.order, "entity.order",entity.order)
            if (item.parentId !== entity.parentId || item.order !== entity.order){
                moveEntity({id: item.id, parentId: entity.parentId, order:entity.order})
            }
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
            order: entity.order
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }))
    
    drag(drop(ref));

    return <>
        {isDragging ? 
        <div ref={dragPreview} className="preview-tile" style={{border: isOver?"2px solid red":""}} ></div> 
        : ( <div className={`book-cover`} ref={ref}>
                <div className="book-header">
                    <span className="entity-type">
                        {getType(entity)}
                    </span>
                    <span className="book-title"><span ref={orderRef}>{entity.order}</span>. {entity.title || "untitled"}</span>
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
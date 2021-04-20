import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";
import ConfirmDelete from "./ConfirmDelete";
import {getAuthorFormatted, getType} from "../Workshop/utils";
import {useDrag} from "react-dnd";
import ItemTypes from "../Workshop/itemTypes";
import TilePosition from "./TilePosition";

export default function EntityBlock({entity, idx, targetEntity}) {

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("edit");

    const [{isDragging, getSourceClientOffset}, drag, dragPreview] = useDrag(()=>({
        item: {
            id: entity.id,
            parentId: entity.parentId,
            typeId: entity.typeId,
            type: ItemTypes.ENTITY_TILE,
            order: idx
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
            getSourceClientOffset: monitor.getSourceClientOffset(),
        })
    }))

    if (isDragging) 
        return <div className="book-cover dragged"  ref={dragPreview} 
            style={{top: getSourceClientOffset.y, 
                    left: getSourceClientOffset.x}}>
                <div className="book-header">
                    <span className="entity-type" ref={drag}>
                        {getType(entity)} 
                    </span>
                    <span className="book-title">"{entity.title || "untitled"}"</span>
                    {!!entity.Pseudonym && <span className="book-author"> by {getAuthorFormatted(entity)}</span>}
                </div>
        </div>
    else
        return <>
            {!!targetEntity && <TilePosition order={idx} parentId={targetEntity?targetEntity.id:null} parentTypeId={!targetEntity?100:targetEntity.typeId} />}
            {!targetEntity && <div className="tile-position"></div>}
            <div className="book-cover" >
                <div className="book-header">
                    <span className="entity-type" ref={drag}>
                        {getType(entity)} 
                    </span>
                    <span className="book-title">"{entity.title || "untitled"}"</span>
                    {!!entity.Pseudonym && <span className="book-author"> by {getAuthorFormatted(entity)}</span>}
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
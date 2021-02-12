import {Droppable, Draggable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {Modal} from '../../context/Modal';
import EntityForm from "./EntityForm";
import {getAuthorFormatted, getType} from "./utils";

function ReordableBlock({id, entity, idx, editMode, setEditMode}) {
    return <Draggable draggableId={`drag-${entity.id}`} index={idx}>
        {(provided)=> 
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
            {/* <i className="fas fa-bars"></i>
            <span>{(entity.title||"untitle")}</span>
            {getAuthorFormatted(entity)?<span>{" by "+getAuthorFormatted(entity)}</span>:""} */}
            <EntityBlock entity={entity} isDraggable={true} />
        </div>}
    </Draggable>
}
function ReorderBlock({id, entities, editMode, setEditMode}) {

    return <Droppable droppableId={`drop-${id}`} direction="horizontal">
        {(provided)=> 
        <div className="book-content" ref={provided.innerRef} {...provided.droppableProps} style={{border: "1px solid tomato"}}>
            {entities.map((entity, idx) => (
                <ReordableBlock entity={entity} id={entity.id} idx={idx} key={`entity-${entity.id}`} editMode={editMode} setEditMode={setEditMode} />
            ))}
            {provided.placeholder}
            <NewEntity parentEntity={{id:id}}/>
        </div> }
    </Droppable>
}

function ChildrenBlock ({entities, editMode, setEditMode}) {
    return <div className="book-content">
        {entities.map((entity,idx) => <EntityBlock entity={entity} key={`entity-${entity.id}`} editMode={editMode} setEditMode={setEditMode} /> )}
    </div>
}

function NewEntity ({parentEntity}) {
    const [showModal, setShowModal] = useState(false);

    return <>
    <div className="add-entity"></div>
    {showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <EntityForm onClose={() => setShowModal(false)}/>
        </Modal>
    )}
    </>
}

export default function EntityBlock({entity, editMode, setEditMode, isDraggable=false}) {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fromType, setFormType] = useState("reset");

    useEffect(()=>{
        if (editMode===entity.id){
            setIsOpen(true)
        }
    },[editMode])

    return <><div className={`book-cover${isOpen?" open":""}`}>
        <div className="book-header">
            <span className="entity-type">
                {getType(entity)}
            </span>
            <span className="book-title">{entity.title || "untitled"}</span>
            {!!entity.Pseudonym && <span className="book-author">by {getAuthorFormatted(entity)}</span>}
        </div>
        {!isDraggable && entity.typeId > 1 && <div className="controls">
            <i className={`fas fa-random${editMode?" active":""}`} onClick={()=>{
                if (editMode==entity.id){
                    setEditMode(null)
                } else {
                    setEditMode(entity.id)
                }
            }} ></i>
            <i className="fas fa-pen-nib" onClick={()=>setShowModal(true)} ></i>
            {isOpen && <i className="fas fa-book-open active" onClick={()=>setIsOpen(!isOpen)} ></i>}
            {!isOpen && <i className="fas fa-book" onClick={()=>setIsOpen(!isOpen)} ></i>}
        </div>}
    </div>
    {!isDraggable && editMode!==entity.id && isOpen && <ChildrenBlock entities={entity.children||[]} editMode={editMode} setEditMode={setEditMode} />}
    {!isDraggable && editMode===entity.id && isOpen && entity.typeId > 1 && <ReorderBlock entities={entity.children} id={entity.id} />}
    {!isDraggable && showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <EntityForm onClose={() => setShowModal(false)} entity={entity}/>
        </Modal>
    )}
    </>
}
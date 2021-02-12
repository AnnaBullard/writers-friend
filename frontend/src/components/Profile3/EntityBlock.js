import {Droppable, Draggable, DragDropContext} from "react-beautiful-dnd";
import {useEffect, useState} from "react";

function getAuthorFormatted(entity) {
    let author = "";
    if (entity.Pseudonym) {
        author += entity.Pseudonym.firstName?entity.Pseudonym.firstName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += entity.Pseudonym.middleName?entity.Pseudonym.middleName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += entity.Pseudonym.lastName?entity.Pseudonym.lastName.replace(/\s+/ig, " "):"";
    }
    return author;
}

function getType(entity){
    switch (entity.typeId) {
        case 4: 
            return "world"
        case 3:
            return "book series"
        case 2:
            return "book"
        case 1:
            if (entity.parentId === null)
                return "story"
            else 
                return "chapter"
    }
}

function ReordableBlock({id, entity, idx, editMode, setEditMode}) {
    return <Draggable draggableId={`drag-${entity.id}`} index={idx}>
        {(provided)=> 
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
            {/* <i className="fas fa-bars"></i>
            <span>{(entity.title||"untitle")}</span>
            {getAuthorFormatted(entity)?<span>{" by "+getAuthorFormatted(entity)}</span>:""} */}
            <EntityBlock entity={entity} key={`entity-${entity.id}`} editMode={editMode} setEditMode={setEditMode} />
        </div>}
    </Draggable>
}
function ReorderBlock({id, entities, editMode, setEditMode}) {

    return <Droppable droppableId={`drop-${id}`}>
        {(provided)=> 
        <div ref={provided.innerRef} {...provided.droppableProps} style={{border: "1px solid tomato"}}>
            {entities.map((entity, idx) => (
                <ReordableBlock entity={entity} id={entity.id} idx={idx} key={`entity-${entity.id}`} editMode={editMode} setEditMode={setEditMode} />
            ))}
            {provided.placeholder}
            Add
        </div> }
    </Droppable>
}

function ChildrenBlock ({entities, editMode, setEditMode}) {
    return <div>
        {entities.map((entity,idx) => <EntityBlock entity={entity} key={`entity-${entity.id}`} editMode={editMode} setEditMode={setEditMode} /> )}
    </div>
}

export default function EntityBlock({entity, editMode, setEditMode}) {
    const [isOpen, setIsOpen] = useState(true);

    return <div className={`book-cover${isOpen?" open":""}`}>
        <div className="book-header">
            {/* <i className="fas fa-bars"></i> */}
            <span className="entity-type">
                {getType(entity)}
            </span>
            <span className="book-title">{entity.title || "untitled"}</span>
            {!!entity.Pseudonym && <span className="book-author">by {getAuthorFormatted(entity)}</span>}
        </div>
        {entity.typeId > 1 && <div className="controls">
            <i className="fas fa-pen-nib" onClick={()=>{
                if (editMode==entity.id){
                    setEditMode(null)
                } else {
                    setEditMode(entity.id)
                }
            }} ></i>
            {isOpen && <i className="fas fa-book-open" onClick={()=>setIsOpen(!isOpen)} ></i>}
            {!isOpen && <i className="fas fa-book" onClick={()=>setIsOpen(!isOpen)} ></i>}
        </div>}
        {/* {editMode!==entity.id && isOpen && <ChildrenBlock entities={entity.children||[]} editMode={editMode} setEditMode={setEditMode} />}
        {editMode===entity.id && entity.typeId > 1 && <ReorderBlock entities={entity.children} id={entity.id} />} */}
        {isOpen && entity.typeId > 1 && <ReorderBlock entities={entity.children} id={entity.id}  editMode={editMode} setEditMode={setEditMode}/>}
    </div>
}
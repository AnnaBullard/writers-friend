import {useState} from "react";
import {Droppable, Draggable} from "react-beautiful-dnd";



export default function EntityBlock({entity, idx}) {
    if (entity.typeId === 4){
        return <div>
            <span>
                {entity.title}
            </span>
            {entity.typeId !== 1 && <Droppable droppableId={`drop-${entity.id}`}>
                {(provided, snapshot)=>
                <div className={`droppable${snapshot.isDraggingOver?" active":""}`} ref={provided.innerRef} {...provided.droppableProps} >
                    {entity.children.map((subentity, idx) =>
                        <EntityBlock entity={subentity} idx={idx} />
                    )}
                    {provided.placeholder}
                </div>}
            </Droppable>}
        </div>
    } else {
        return <Draggable draggableId={`drag-${entity.id}`} index={entity.order>0?entity.order:idx}>
            {(provided, snapshot)=>
            <div ref={provided.innerRef} {...provided.draggableProps}>
                <span className="draggable" {...provided.dragHandleProps}>
                    {entity.title}
                </span>
                {entity.typeId !== 1 && <Droppable droppableId={`drop-${entity.id}`}>
                    {(provided, snapshot)=>
                    <div className={`droppable${snapshot.isDraggingOver?" active":""}`} ref={provided.innerRef} {...provided.droppableProps} >
                        {entity.children.map((subentity,idx) =>
                            <EntityBlock entity={subentity} idx={idx} />
                        )}
                        {provided.placeholder}
                    </div>}
                </Droppable>}
            </div>
            }
        </Draggable>
    }
}
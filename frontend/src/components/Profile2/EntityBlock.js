import {Droppable, Draggable} from "react-beautiful-dnd";

export default function EntityBlock({entity, idx, notDroppable}) {
    // if (entity.typeId === 4){
    //     return <div>
    //         <span>
    //             {entity.title}
    //         </span>
    //         {entity.typeId !== 1 && <Droppable droppableId={`drop-${entity.id}`}>
    //             {(provided, snapshot)=>
    //             <div className={`droppable${snapshot.isDraggingOver?" active":""}`} ref={provided.innerRef} {...provided.droppableProps} >
    //                 {entity.children.map((subentity, idx) =>
    //                     <EntityBlock entity={subentity} idx={idx} notDroppable={notDroppable} key={`drop-${entity.id}-drop-${idx}`}/>
    //                 )}
    //                 {provided.placeholder}
    //             </div>}
    //         </Droppable>}
    //     </div>
    // } else {
        return <Draggable draggableId={`drag-${entity.id}`} index={idx}>
            {(dragProvided, snapshot)=>
            <div className="draggable" ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                <span {...dragProvided.dragHandleProps}>
                    {entity.title}
                </span>
                {(entity.typeId !== 1) && <Droppable droppableId={`drop-${entity.id}`}>
                    {(dropProvided, snapshot)=>
                    <div className={`droppable${snapshot.isDraggingOver?" active":""}`} ref={dropProvided.innerRef} {...dropProvided.droppableProps} >
                        {entity.children.map((subentity,idx) =>
                            <EntityBlock entity={subentity} idx={idx} notDroppable={notDroppable} key={`drop-${entity.id}-drop-${idx}`} />
                        )}
                        {dropProvided.placeholder}
                    </div>}
                </Droppable>}
            </div>
            }
        </Draggable>
    // }
}
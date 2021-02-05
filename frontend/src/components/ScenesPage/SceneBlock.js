import {Draggable} from "react-beautiful-dnd";

export default function SceneBlock ({scene, index, joinFn}) {
    return <>
    {(index > 0 ) && <div className="connect-block" onClick={joinFn}>
        <i className="fas fa-link"></i>
    </div>}
    <Draggable draggableId={`scene-${scene.id}`} index={scene.order}>
        {provided => (
            <div className="scene-block" ref={provided.innerRef} {...provided.draggableProps}>
                {/* <div className="scene-text"><textarea value={scene.text}></textarea></div> */}
                <div className="scene-text">{scene.text}</div>
                <div className="scene-handle">
                    <i className="fas fa-arrows-alt-v" {...provided.dragHandleProps}></i>
                    <i className="fas fa-cut"></i>
                    <i className="fas fa-eraser"></i>
                </div>
            </div>
        )}
    </Draggable>
    </>
}

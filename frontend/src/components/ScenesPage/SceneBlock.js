import {Draggable} from "react-beautiful-dnd";
import {useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import ConfirmDelete from "./ConfirmDelete";
import {Modal} from '../../context/Modal';

export default function SceneBlock ({scene, index, joinFn}) {
    const [showModal, setShowModal] = useState(false);
    const [fromType, setFormType] = useState("delete");

    const onDelete = () =>{
        setFormType("delete")
        setShowModal(true)
    }

    return <Draggable draggableId={`scene-${scene.id}`} index={scene.order}>
        {provided => (
            <>
                {(index > 0 ) && <div className="connect-block" onClick={joinFn}>
                    <i className="fas fa-link"></i>
                </div>}
                <div className="scene-block" ref={provided.innerRef} {...provided.draggableProps}>
                    {/* <div className="scene-text"><textarea value={scene.text}></textarea></div> */}
                    <div className="scene-text">{scene.text}</div>
                    <div className="scene-handle">
                        <i className="fas fa-arrows-alt-v" {...provided.dragHandleProps}></i>
                        <i className="fas fa-cut"></i>
                        <i className="fas fa-eraser" onClick={onDelete}></i>
                    </div>
                </div>
                {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                {(fromType==="delete") &&
                    <ConfirmDelete onSubmit={()=>{console.log(scene.id)}} onClose={() => setShowModal(false)} scene={scene}/>
                }
                </Modal>
            )}
            </>
        )}
    </Draggable>
}

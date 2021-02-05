import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {useParams} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {useState,useEffect} from "react";
import {getScenes} from "../../store/scenes";
import "./ScenesPage.css"

export default function ScenesPage () {
    const [isLoaded, setIsLoaded] = useState(false);
    const [title, setTitle] = useState();
    const dispatch = useDispatch();

    let {bookId} =useParams();
    bookId = parseInt(bookId);

    let book = useSelector(state => state.scenes.book);
    let scenes = useSelector(state => state.scenes.scenes);

    useEffect(()=>{
        dispatch(getScenes(16))
    },[dispatch])
    
    useEffect(()=>{
        if (book) {
            setTitle(book.title)
            setIsLoaded(true);
        }
    },[book])

    const onDragEnd = result => {
        if (result.destination) {
            let sceneId = parseInt(result.draggableId.split("-")[1]);
            let newOrder = result.destination.index;
            console.log({
                sceneId,
                newOrder
            })
        }
        console.log(result);
    };

    return isLoaded && <>
        <input 
            type="text" 
            value={title}
            onChange={e=>{setTitle(e.target.value)}}
            className="title-input"
            />
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={`book-${bookId}`}>
                {provided => (
                    <div className="scenes-list" ref={provided.innerRef} {...provided.droppableProps}>
                        {scenes.map((scene, index) => (
                            <>
                            {(index > 0 ) && <div className="connect-block" onClick={()=>{console.log(scenes[index-1].id,":",scene.id)}}>
                                <i className="fas fa-link"></i>
                                <div className="connect-line"></div>
                            </div>}
                            <Draggable draggableId={`scene-${scene.id}`} index={scene.order}>
                                {provided => (
                                    <div className="scene-block" ref={provided.innerRef} {...provided.draggableProps}>
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
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </>
}

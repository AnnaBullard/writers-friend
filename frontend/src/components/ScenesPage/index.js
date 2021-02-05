import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {useParams} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {useState,useEffect, Fragment} from "react";
import {getScenes, setNewOrder, setNewTitle,saveScenes} from "../../store/scenes";
import "./ScenesPage.css"

export default function ScenesPage () {
    const [isLoaded, setIsLoaded] = useState(false);
    const [title, setTitle] = useState();
    const [saved, setSaved] = useState();
    const dispatch = useDispatch();

    let {bookId} =useParams();
    bookId = parseInt(bookId);

    let story = useSelector(state => state.scenes);

    useEffect(()=>{
        dispatch(getScenes(16))
    },[dispatch])
    
    useEffect(()=>{
        if (story.book) {
            setTitle(story.book.title)
            setIsLoaded(true);
        }
        setSaved(story.saved)
    },[story])

    const onDragEnd = result => {
        if (result.destination !== null) {
            let sceneId = parseInt(result.draggableId.split("-")[1]);
            let newNumber = result.destination.index;
            let oldNumber = result.source.index;
            let newOrder = story.scenes.map(s => s.id)
            newOrder = [...newOrder.slice(0,oldNumber),...newOrder.slice(oldNumber+1)]
            newOrder = [...newOrder.slice(0,newNumber),sceneId,...newOrder.slice(newNumber)]
            console.log(newOrder)
            dispatch(setNewOrder(newOrder))
        }
        console.log(result);
    };

    const onSave = () => {
        let updates = {title, delete: story.delete}
        let scenes = {}
        story.scenes.forEach(scene => {
            console.log("this story:", scene)
            if (scene.updated) {
                scenes[scene.id] = scene
            }
        })
        updates.scenes = scenes;
        console.log("ready updates", updates)
        dispatch(saveScenes(bookId, updates))
    }

    return isLoaded && <>
        <input 
            type="text" 
            value={title}
            onChange={e=>{dispatch(setNewTitle(e.target.value))}}
            className="title-input"
            /><button onClick={onSave}>Save</button>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={`book-${bookId}`}>
                {provided => (
                    <div className="scenes-list" ref={provided.innerRef} {...provided.droppableProps}>
                        {story.scenes.map((scene, index) => (
                            <Fragment key={`scene-${scene.id}`}>
                            {(index > 0 ) && <div className="connect-block" onClick={()=>{console.log(story.scenes[index-1].id,":",scene.id)}}>
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
                            </Fragment>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </>
}

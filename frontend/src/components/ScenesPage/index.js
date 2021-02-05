import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {useParams} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {useState,useEffect, Fragment} from "react";
import {getScenes, setNewOrder, setNewTitle,saveScenes} from "../../store/scenes";
import SceneBlock from "./SceneBlock";
import "./ScenesPage.css"

export default function ScenesPage () {
    const [isLoaded, setIsLoaded] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [title, setTitle] = useState();
    const [saved, setSaved] = useState();
    const dispatch = useDispatch();

    let {bookId} =useParams();
    bookId = parseInt(bookId);

    let story = useSelector(state => state.scenes);
    let user = useSelector(state => state.session.user);

    useEffect(()=>{
        dispatch(getScenes(bookId))
    },[dispatch])
    
    useEffect(()=>{
        if (story.book) {
            setTitle(story.book.title)
            setIsLoaded(true);
        }
        setSaved(story.saved)
        if (user && story.book && story.book.userId === user.id){
            setAuthorized(true)
        }
    },[story, user])

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

    if (!authorized) {
        return <h1>Page not found</h1>
    } else {
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
                                <SceneBlock  key={`scene-${scene.id}`} scene={scene} index={index} joinFn={()=>{console.log(story.scenes[index-1].id,":",scene.id)}} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    }
}

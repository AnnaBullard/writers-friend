import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {useParams, Link} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {useState,useEffect, Fragment} from "react";
import {Modal} from '../../context/Modal';
import ConfirmReset from "./ConfirmReset";
import {getScenes, setNewOrder, setNewTitle,saveScenes} from "../../store/scenes";
import SceneBlock from "./SceneBlock";
import "./ScenesPage.css"

export default function ScenesPage () {
    const [isLoaded, setIsLoaded] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fromType, setFormType] = useState("reset");
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
        
    },[story, user])

    useEffect(()=>{
        if (user && story.book && story.book.userId === user.id){
            setAuthorized(true)
        } else {
            setAuthorized(false)
        }
    }, [isLoaded])

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

    const onReset = () => {
        setFormType("reset")
        setShowModal(true);
    }

    if (!authorized) {
        return isLoaded && <>
        <h1>Page not found</h1>
        <div>Go to the <Link to="/">Home Page</Link></div>
        </>
    } else {
        return isLoaded && <>
            <div className="story-controls">
                <button onClick={onSave} disabled={saved?"disabled":false}>Save</button>
                <button onClick={onReset} disabled={saved?"disabled":false}>Reset</button>
                <button>Publish</button>
            </div>
            <input 
                type="text" 
                value={title}
                onChange={e=>{dispatch(setNewTitle(e.target.value))}}
                className="title-input"
                />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`book-${bookId}`}>
                    {(provided, snapshot) => (
                        <div className={`scenes-list${snapshot.isDraggingOver?" active":""}`} ref={provided.innerRef} {...provided.droppableProps}>
                            {story.scenes.map((scene, index) => (
                                <SceneBlock  key={`scene-${scene.id}`} scene={scene} index={index} joinFn={()=>{console.log(story.scenes[index-1].id,":",scene.id)}} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                {(fromType==="reset") &&
                    <ConfirmReset onSubmit={()=>{dispatch(getScenes(bookId))}} onClose={() => setShowModal(false)}/>
                }
                </Modal>
            )}
        </>
    }
}

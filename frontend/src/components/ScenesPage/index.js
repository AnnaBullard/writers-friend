import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useParams} from "react-router-dom";
import {Prompt} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {useState,useEffect} from "react";
import sanitizeHtml from 'sanitize-html';
import {Modal} from '../../context/Modal';
import ConfirmReset from "./ConfirmReset";
import {getScenes, setNewOrder, setNewTitle, 
        saveScenes, joinScenes, createScene} from "../../store/scenes";
import SceneBlock from "./SceneBlock";
import Sidebar from "./Sidebar";
import PageNotFound from "../PageNotFound"
import "./ScenesPage.css"

export default function ScenesPage () {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fromType, setFormType] = useState("reset");
    const [title, setTitle] = useState("");
    const dispatch = useDispatch();

    const saved = useSelector(state => state.scenes.saved)
    //Handling re-load of the page with usaved changes
    const handleOnBeforeUnload = e => {
        if (!saved) {
            return true
        } else {
            return undefined
        }
    }
    
    window.onbeforeunload = handleOnBeforeUnload;

    let {chapterId} =useParams();
    chapterId = parseInt(chapterId);

    let story = useSelector(state => state.scenes);

    useEffect(()=>{
        dispatch(getScenes(chapterId)).then(res => {
            setAuthorized(res);
            setIsLoaded(true);
        })
    },[dispatch, chapterId])
    
    useEffect(()=>{
        if (story.chapter) {
            setTitle(story.chapter.title)
        }        
    },[story])

    const onDragEnd = result => {
        if (result.destination !== null) {
            let sceneId = result.draggableId.split("-")[1]
            if (!sceneId.startsWith("new")) sceneId = parseInt(sceneId);
            let newNumber = result.destination.index;
            let oldNumber = result.source.index;
            let newOrder = story.scenes.map(s => s.id)
            newOrder = [...newOrder.slice(0,oldNumber),...newOrder.slice(oldNumber+1)]
            newOrder = [...newOrder.slice(0,newNumber),sceneId,...newOrder.slice(newNumber)]
            dispatch(setNewOrder(newOrder))
        }
    };

    const onSave = () => {
        let updates = {title}
        updates.deleted = story.deleted.filter(id => typeof id === "number")
        updates.scenes = {};
        updates.new = [];
        story.scenes.forEach(scene => {
            if (scene.updated && typeof scene.id === "number") {
                if (scene.temp){
                    updates.scenes[scene.id] = {...scene, text: sanitizeHtml(scene.temp)}
                } else {
                    updates.scenes[scene.id] = {...scene, text: sanitizeHtml(scene.text)}
                }
            } else if(scene.updated && typeof scene.id !== "number") {
                updates.new.push(scene)
            }
        })
        dispatch(saveScenes(chapterId, updates))
    }

    const onReset = () => {
        setFormType("reset")
        setShowModal(true);
    }

    if (!authorized) {
        return isLoaded && <PageNotFound />
    } else {
        return isLoaded && <>
            <Prompt
            when={!saved}
            message='You have unsaved changes, are you sure you want to leave?'
            />
            <Sidebar onSave={onSave} onReset={onReset} isOpen={isOpen} setIsOpen={setIsOpen} saved={saved}/>
            <div className={`main-content${isOpen?" open":""}`}>
                <input 
                    type="text" 
                    value={title}
                    onChange={e=>{dispatch(setNewTitle(e.target.value))}}
                    className="title-input"
                    />
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={`chapter-${chapterId}`}>
                        {(provided, snapshot) => (
                            <div className={`scenes-list${snapshot.isDraggingOver?" active":""}`} ref={provided.innerRef} {...provided.droppableProps}>
                                {story.scenes.map((scene, index) => (
                                    <SceneBlock  key={`scene-${scene.id}`} scene={scene} index={index} joinFn={()=>{dispatch(joinScenes(story.scenes[index-1].id,scene.id))}} isLast={index===story.scenes.length-1} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="new-scene" onClick={()=>{dispatch(createScene())}}><i className="fas fa-plus"></i></div>
            </div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                {(fromType==="reset") &&
                    <ConfirmReset onSubmit={()=>{dispatch(getScenes(chapterId))}} onClose={() => setShowModal(false)}/>
                }
                </Modal>
            )}
        </>
    }
}

import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {getEntities} from "../../store/entities";
import EntityBlock from "./EntityBlock";
import "./Profile.css"

export default function Profile () {
    const dispatch = useDispatch();
    const [isAuthorized, setAuthorized] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [notDroppable,setNotDroppable] = useState(null);

    let user = useSelector(state => state.session.user)
    let entities = useSelector(state => state.entities)

    useEffect(()=>{
        if (user){
            setAuthorized(true)
            //getPseudonyms
            dispatch(getEntities()).then(res=>{setIsLoaded(true)});
        } else {
            setAuthorized(false)
        }
    },[dispatch, user])

    const onDragStart = result => {
        setNotDroppable(result.draggableId)
        console.log("start", result);
    }
    const onDragUpdate = result => {
        console.log("update", result);
    }
    const onDragEnd = result => {
        console.log("end", result);
        
    }

    if (!isAuthorized) {
        return <h1>Page not found</h1>
    } else {
        return isLoaded && <>
            <h1>Hello, {user.username}</h1>
            <div>
                <DragDropContext 
                    onDragStart={onDragStart}
                    onDragUpdate={onDragUpdate}
                    onDragEnd={onDragEnd}
                >
                    <Droppable droppableId="drop-0">
                        {(provided, snapshot)=>
                        <div className={`droppable${snapshot.isDraggingOver?" active":""}`} ref={provided.innerRef} {...provided.droppableProps} >
                            {entities.map((entity,idx) => 
                                <EntityBlock entity={entity} idx={idx} notDroppable={notDroppable} key={`drop-0-drop-${idx}`}/>
                            )}
                            {provided.placeholder}
                        </div>
                        }
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    }
}
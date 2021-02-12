import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {getEntities} from "../../store/entities";
import EntityBlock from "./EntityBlock";
// import "./Profile.css"

export default function Profile () {
    const dispatch = useDispatch();
    const [isAuthorized, setAuthorized] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [editMode, setEditMode] = useState(null);

    let user = useSelector(state => state.session.user)
    let entities = useSelector(state => state.entities)

    useEffect(()=>{
        if (user){
            setAuthorized(true)
            dispatch(getEntities()).then(res=>{setIsLoaded(true)});
        } else {
            setAuthorized(false)
        }
    },[dispatch, user])

    useEffect(()=>{
        console.log(editMode)
    },[editMode])

    const onDragEnd = result => {
        console.log(result);
    }

    if (!isAuthorized) {
        return <h1>Page not found</h1>
    } else {
        return isLoaded && <>
            <h1>Hello, {user.username}</h1>
            <div className={`entities-grid`} >
            <DragDropContext onDragEnd={onDragEnd} >
                {entities.map((entity,idx) => 
                    <EntityBlock entity={entity} key={`drop-0-drop-${idx}`} editMode={editMode} setEditMode={setEditMode} />
                )}
            </DragDropContext>
            </div>
        </>
    }
}
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect, createContext} from "react";
import {useHistory,Link} from "react-router-dom";
import {getEntities, update} from "../../store/entities";
import {quickStart} from "../../store/scenes";
import EntitiesTiles from "../EntitiesTiles";
import EntitiesTree from "../EntitiesTree";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export const WorkshopContext = createContext()

export default function Workshop () {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);

    const user = useSelector(state => state.session.user)

    useEffect(()=>{
        if (user!==null){
            document.title = `Writer's Friend - Workshop`;
            dispatch(getEntities()).then(res => { setIsLoaded(true) });
        }
    },[dispatch, user])

    const onQuickStart = () =>{
        dispatch(quickStart()).then(id => {
            if (id) {
                history.push(`/scenes/${id}`)
            }
        })
    }

    const moveEntity = entity => {
        dispatch(update(entity))
    }

    return isLoaded && <>
        <div className="profile-header">
            <h1>Workshop</h1>
            <button onClick={onQuickStart}>Start Writing</button>
        </div>
        <h3 className="entities-top-link"><Link to="/workshop">All</Link></h3>
        <div className="entities">
            <DndProvider backend={HTML5Backend}>
            <WorkshopContext.Provider value={moveEntity}>
                <EntitiesTree />
                <EntitiesTiles />
            </WorkshopContext.Provider>
            </DndProvider>
        </div>
    </>
}
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getEntities} from "../../store/entities";
import {quickStart} from "../../store/scenes";
import EntityBlock from "./EntityBlock";
import NewEntity from "./NewEntity";
import Sidebar from "./Sidebar";
import PageNotFound from "../PageNotFound";
import "./Profile.css"

export default function Profile () {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isAuthorized, setAuthorized] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    let user = useSelector(state => state.session.user)
    let entities = useSelector(state => state.entities)

    useEffect(()=>{
        if (user){
            document.title = `Writer's Friend - Workshop`
            setAuthorized(true)
            dispatch(getEntities()).then(res=>{setIsLoaded(true)});
        } else {
            setAuthorized(false)
        }
    },[dispatch, user])

    const onQuickStart = () =>{
        dispatch(quickStart()).then(id => {
            if (id) {
                history.push(`/scenes/${id}`)
            }
        })
    }

    if (!isAuthorized) {
        return <PageNotFound />
    } else {
        return isLoaded && <>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className={`main-content${isOpen?" open":""}`}>
            <div className="profile-header"><h1>Hello, {user.username}</h1><button onClick={onQuickStart}>Start Writing</button></div>
            <div className={`entities-grid`} >
                {entities.map((entity,idx) => 
                    <EntityBlock entity={entity} key={`drop-0-drop-${idx}`} />
                )}
                <NewEntity />
            </div>
        </div>
        </>
    }
}
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {useHistory,Link} from "react-router-dom";
import {getEntities} from "../../store/entities";
import {quickStart} from "../../store/scenes";
import EntitiesTiles from "../EntitiesTiles";
// import EntitiesList from "./EntitiesList";
import EntitiesTree from "../EntitiesTree";

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

    return isLoaded && <>
        <div className="profile-header">
            <h1>Workshop</h1>
            <button onClick={onQuickStart}>Start Writing</button>
        </div>
        <h3 className="entities-top-link"><Link to="/workshop">All</Link></h3>
        <div className="entities">
            <EntitiesTree />
            <EntitiesTiles />
        </div>
    </>
}
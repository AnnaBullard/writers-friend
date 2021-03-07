import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect, useMemo} from "react";
import {useHistory} from "react-router-dom";
import {getEntities} from "../../store/entities";
import {quickStart} from "../../store/scenes";
import EntitiesList from "./EntitiesList";

export default function Workshop () {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);

    const user = useSelector(state => state.session.user)
    const pseudonyms = useSelector(state=> state.pseudonyms);

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
        <EntitiesList />
    </>
}
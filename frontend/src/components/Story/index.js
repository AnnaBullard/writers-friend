import {useParams, Link} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import {getScenes} from "../../store/scenes";
import sanitizeHtml from 'sanitize-html';
import PageNotFound from "../PageNotFound";

export default function Story () {
    let {storyId} = useParams();
    storyId = parseInt(storyId);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const story = useSelector(state => state.scenes)
    const user = useSelector(state => state.session.user)

    useEffect(()=>{
        dispatch(getScenes(storyId)).then(res => {
            setAuthorized(res)
            setIsLoaded(true)
        })
    },[dispatch])

    if (!authorized) {
        return isLoaded && <PageNotFound />
    } else {
        return isLoaded &&  <div>
        <h1>{story.chapter.title || "untitled"}
        {user.id === story.chapter.userId && 
        <Link to={`/scenes/${storyId}`}><i className="fas fa-pen-nib"></i></Link>} 
        {user.id === story.chapter.userId && story.chapter.isPublished && <i className="fas fa-eye"></i>}
        {user.id === story.chapter.userId && !story.chapter.isPublished && <i className="fas fa-eye-slash"></i>}
        </h1>
        {story.scenes.map(scene => <div dangerouslySetInnerHTML={{__html: sanitizeHtml(scene.text)}}></div>)}
    </div>
    }
}
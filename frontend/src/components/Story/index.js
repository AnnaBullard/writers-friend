import {useParams, Link} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {getToRead} from "../../store/scenes";
import sanitizeHtml from 'sanitize-html';
import PageNotFound from "../PageNotFound";

export default function Story ({setPageTitle}) {
    let {storyId} = useParams();
    storyId = parseInt(storyId);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const story = useSelector(state => state.scenes)
    const user = useSelector(state => state.session.user)

    useEffect(()=>{
        setPageTitle("");
    },[setPageTitle])

    useEffect(()=>{
        dispatch(getToRead(storyId)).then(res => {
            setAuthorized(res)
            setIsLoaded(true)
        })
    },[dispatch, storyId])

    useEffect(()=>{
        if(story.chapter) {
            document.title = `Writer's Friend - ${story.chapter.title||"untitled"}`
        }
    },[story])

    if (!authorized) {
        return isLoaded && <PageNotFound />
    } else {
        return isLoaded &&  <div className="main-content">
            <div className="story-page">
                <h1>
                    <span>{story.chapter.title || "untitled"}</span>
                    <span>
                        {user.id === story.chapter.userId && 
                        <Link to={`/scenes/${storyId}`}><i className="fas fa-pen-nib"></i></Link>} 
                        {user.id === story.chapter.userId && story.chapter.isPublished && <i className="fas fa-eye"></i>}
                        {user.id === story.chapter.userId && !story.chapter.isPublished && <i className="fas fa-eye-slash"></i>}
                    </span>
                </h1>
                {story.scenes.map(scene => <div key={`story-scene-${scene.id}`} dangerouslySetInnerHTML={{__html: sanitizeHtml(scene.text)}}></div>)}
            </div>
        </div>
    }
}
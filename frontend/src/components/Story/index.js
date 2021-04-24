import {useParams, Link} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {getStory} from "../../store/story";
import sanitizeHtml from 'sanitize-html';
import PageNotFound from "../PageNotFound";
import BookList from "./BookList";

export default function Story ({setPageTitle}) {
    let {storyId} = useParams();
    storyId = parseInt(storyId);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [story, setStory] = useState()

    const children = useSelector(state => state.story.children)
    const siblings = useSelector(state => state.story.siblings)
    const user = useSelector(state => state.session.user)

    useEffect(()=>{
        setPageTitle("");
    },[setPageTitle])

    useEffect(()=>{
        if (!story || story.id !== storyId) {
            let a = siblings.find(item => item.id === storyId)
            if (a) {
                setStory(a);
            };
        }
    },[storyId, siblings, story])

    useEffect(()=>{
        dispatch(getStory(storyId)).then(res => {
            setAuthorized(res)
            setIsLoaded(true)
        })
    },[dispatch, storyId])

    useEffect(()=>{
        if(story) {
            document.title = `Writer's Friend - ${story.title||"untitled"}`
        }
    },[story])

    if (!authorized) {
        return isLoaded && <PageNotFound />
    } else {
        return isLoaded && <div className="main-content">
            <div className="previous">
                {(story.idx!==0) && <Link to={`/story/${siblings[story.idx-1].id}`}>Previous</Link>}
            </div>
            <div className="story-page">
                <h1>
                    <span>{story.title || "untitled"}</span>
                    <span>
                        {user.id === story.userId && 
                        <Link to={`/scenes/${storyId}`}><i className="fas fa-pen-nib"></i></Link>} 
                        {user.id === story.userId && story.isPublished && <i className="fas fa-eye"></i>}
                        {user.id === story.userId && !story.isPublished && <i className="fas fa-eye-slash"></i>}
                    </span>
                </h1>
                {(story.typeId === 1) ? 
                    children.map(scene => <div key={`story-scene-${scene.id}`} dangerouslySetInnerHTML={{__html: sanitizeHtml(scene.text)}}></div>) :
                    <BookList books={children} />}
            </div>
            <div className="next">
                {(story.idx!==siblings.length-1) && <Link to={`/story/${siblings[story.idx+1].id}`}>Next</Link>}
            </div>
        </div>
    }
}
import {useHistory,useParams} from "react-router-dom";

export default function Sidebar ({isOpen, setIsOpen, onSave, onReset, saved}) {
    const history = useHistory();
    const {chapterId} = useParams();

    return <div className={`sidebar-container${isOpen?" open":""}`}>
        <span className={`open-sidebar${!saved?" active":""}`} onClick={()=>setIsOpen(true)}><i className="fas fa-chevron-circle-right"></i></span>
        <div className="sidebar">
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <div className="story-controls">
                    <button onClick={onSave} disabled={saved?"disabled":false}><i className="fas fa-save"></i><span>Save</span></button>
                    <button onClick={onReset} disabled={saved?"disabled":false}><i className="fas fa-undo-alt"></i><span>Reset</span></button>
                    <button onClick={()=>history.push(`/story/${chapterId}`)}><i className="fas fa-book-open"></i><span>Read mode</span></button>
            </div>
        </div>
    </div>
}

import {useHistory,useParams} from "react-router-dom";
import Sidebar from "../Sidebar";

export default function SidebarControls ({isOpen, setIsOpen, onSave, onReset, saved}) {
    const history = useHistory();
    const {chapterId} = useParams();

    return <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} active={!saved} showOnMobile={true} showOnDesktop={true}>
            <div className="story-controls">
                    <button onClick={onSave} disabled={saved?"disabled":false}><i className="fas fa-save"></i><span>Save</span></button>
                    <button onClick={onReset} disabled={saved?"disabled":false}><i className="fas fa-undo-alt"></i><span>Reset</span></button>
                    <button onClick={()=>history.push(`/story/${chapterId}`)}><i className="fas fa-book-open"></i><span>Read mode</span></button>
            </div>
    </Sidebar>
}

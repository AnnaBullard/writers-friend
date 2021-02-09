import {useDispatch,useSelector} from "react-redux";
import {useState, useEffect} from "react";

export default function Sidebar ({isOpen, setIsOpen, title, onSave, onReset, saved}) {
    const dispatch = useDispatch();

    let story = useSelector(state => state.scenes);

    return <div className={`sidebar-container${isOpen?" open":""}`}>
        <span className="openSidebar" onClick={()=>setIsOpen(true)}>Open</span>
        <div className="sidebar">
            <span className="closeSidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <div className="story-controls">
                    <button onClick={onSave} disabled={saved?"disabled":false}>Save</button>
                    <button onClick={onReset} disabled={saved?"disabled":false}>Reset</button>
                    <button>Publish</button>
            </div>
        </div>
    </div>
}

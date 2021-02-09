export default function Sidebar ({isOpen, setIsOpen, onSave, onReset, saved}) {

    return <div className={`sidebar-container${isOpen?" open":""}`}>
        <span className="open-sidebar" onClick={()=>setIsOpen(true)}>Open</span>
        <div className="sidebar">
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <div className="story-controls">
                    <button onClick={onSave} disabled={saved?"disabled":false}>Save</button>
                    <button onClick={onReset} disabled={saved?"disabled":false}>Reset</button>
                    <button>Publish</button>
            </div>
        </div>
    </div>
}

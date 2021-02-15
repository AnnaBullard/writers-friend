import PseudonymsList from "../Pseudonyms";

export default function Sidebar ({isOpen, setIsOpen}) {

    return <div className={`sidebar-container${isOpen?" open":""}`}>
        <span className="open-sidebar" onClick={()=>setIsOpen(true)}>Open</span>
        <div className="sidebar">
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <PseudonymsList />
        </div>
    </div>
}
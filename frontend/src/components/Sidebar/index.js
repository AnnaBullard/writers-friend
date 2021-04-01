export default function Sidebar ({isOpen, setIsOpen, active, children}) {

    return <div className={`sidebar-container${isOpen?" open":""}`}>
        <span className={`open-sidebar${active?" active":""}`} onClick={()=>setIsOpen(true)}><i className="fas fa-chevron-circle-right"></i></span>
        <div className="sidebar">
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            {children}
        </div>
    </div>
}

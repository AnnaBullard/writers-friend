export default function Sidebar ({isOpen, setIsOpen, active, children, right, forcedMobile}) {


    return <div className={`sidebar-container${isOpen?" open":""}${right?" right":""}${forcedMobile?" mobile-sidebar":""}`}>
        <span className={`open-sidebar${active?" active":""}`} onClick={() => {setIsOpen(true)}}><i className="fas fa-chevron-circle-right"></i></span>
        <div className="sidebar">
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            {children}
        </div>
    </div>
}

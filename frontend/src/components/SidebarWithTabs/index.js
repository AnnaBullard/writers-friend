import { useState } from "react"

export default function SidebarWithTabs ({isOpen, setIsOpen, active, children}) {
    const [activeTab, setActiveTab] = useState("left");

    return <div className={`sidebar-container${isOpen?" open":""} mobile-sidebar`}>
        <span className={`open-sidebar${active?" active":""}`} onClick={() => {setIsOpen(true)}}><i className="fas fa-chevron-circle-right"></i></span>
        <div className={`sidebar ${activeTab}`}>
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <div className="sidebar-tabs-navigation story-controls">
                <button onClick={()=>{setActiveTab("left")}} className={activeTab==="left"?"active":""}>All works</button>
                <button onClick={()=>{setActiveTab("right")}} className={activeTab==="right"?"active":""}>Details</button>
            </div>
            {children}
        </div>
    </div>
}

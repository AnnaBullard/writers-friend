import { useState } from "react"

export default function SidebarWithTabs ({isOpen, setIsOpen, children, showOmMobile, showOnDesktop, tabs}) {
    const [activeTab, setActiveTab] = useState("one");
    let tabClasses = ["one", "two", "three", "four", "five"];

    
    let responsiveClass = "";
    if (showOmMobile && showOnDesktop) {
        responsiveClass = " mobile-desktop";
    } else if (showOmMobile && !showOnDesktop){
        responsiveClass = " mobile-only";
    } else if (!showOmMobile && showOnDesktop){
        responsiveClass = " desktop-only";
    } 

    return <div className={`sidebar-container${isOpen?" open":""} sidebar-with-tabs${responsiveClass}`}>
        <span className={`open-sidebar active`} onClick={() => {setIsOpen(true)}}><i className="fas fa-chevron-circle-right"></i></span>
        <div className={`sidebar ${activeTab}`}>
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <div className="sidebar-tabs-navigation story-controls">
                {tabs.map((tab,idx)=>{
                    return <button onClick={()=>{setActiveTab(tabClasses[idx])}} className={activeTab===tabClasses[idx]?"active":""}>{tab}</button>
                })}
            </div>
            <div className="tab-content">
                {children}
            </div>
        </div>
    </div>
}

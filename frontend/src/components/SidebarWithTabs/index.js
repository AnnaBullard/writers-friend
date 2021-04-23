import { useState } from "react"

export default function SidebarWithTabs ({isOpen, setIsOpen, children, showOnMobile, showOnDesktop, tabs}) {
    const [activeTab, setActiveTab] = useState("one");
    let tabClasses = ["one", "two", "three", "four", "five"];

    
    let responsiveClass = "";
    if (showOnMobile && showOnDesktop) {
        responsiveClass = " mobile-desktop";
    } else if (showOnMobile && !showOnDesktop){
        responsiveClass = " mobile-only";
    } else if (!showOnMobile && showOnDesktop){
        responsiveClass = " desktop-only";
    } 

    if (isOpen) return <div className={`sidebar-container${isOpen?" open":""} sidebar-with-tabs${responsiveClass}`}>
        <div className={`open-sidebar${responsiveClass}`}>
            {tabs.map((tab,idx)=>{
                return <button key={`tabs-button-${idx}`} onClick={()=>{
                    setIsOpen(true);
                    setActiveTab(tabClasses[idx]);
                }} className={activeTab===tabClasses[idx]?"active":""}>
                    <span>
                        {tab}
                    </span>
                </button>
            })}
        </div>
        <div className={`sidebar ${activeTab}`}>
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <div className="tab-content">
                {children}
            </div>
        </div>
    </div>
    else return <div className={`open-sidebar${responsiveClass}`}>
        {tabs.map((tab,idx)=>{
            return <button key={`tabs-button-${idx}`} onClick={()=>{
                setIsOpen(true);
                setActiveTab(tabClasses[idx]);
            }} className={activeTab===tabClasses[idx]?"active":""}>
                <span>
                    {tab}
                </span>
            </button>
        })}
    </div>
}

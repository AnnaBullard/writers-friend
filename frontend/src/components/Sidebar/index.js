export default function Sidebar ({isOpen, setIsOpen, active, children, showOnMobile, showOnDesktop}) {

    let responsiveClass = "";
    if (showOnMobile && showOnDesktop) {
        responsiveClass = " mobile-desktop";
    } else if (showOnMobile && !showOnDesktop){
        responsiveClass = " mobile-only";
    } else if (!showOnMobile && showOnDesktop){
        responsiveClass = " desktop-only";
    } 

    if (isOpen) return <div className={`sidebar-container${isOpen?" open":""}${responsiveClass}`}>
        <div className="sidebar">
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            <div className="content">
                {children}
            </div>
        </div>
    </div>
    else return <div className={`open-sidebar${active?" active":""}${responsiveClass}`}>
        <button  onClick={() => {setIsOpen(true)}}>
            <i className="fas fa-chevron-circle-right"></i>
        </button>
    </div>
}

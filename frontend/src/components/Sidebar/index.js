export default function Sidebar ({isOpen, setIsOpen, active, children, right, showOmMobile, showOnDesktop}) {

    let responsiveClass = "";
    if (showOmMobile && showOnDesktop) {
        responsiveClass = " mobile-desktop";
    } else if (showOmMobile && !showOnDesktop){
        responsiveClass = " mobile-only";
    } else if (!showOmMobile && showOnDesktop){
        responsiveClass = " desktop-only";
    } 

    return <div className={`sidebar-container${isOpen?" open":""}${right?" right":""}${responsiveClass}`}>
        <span className={`open-sidebar${active?" active":""}`} onClick={() => {setIsOpen(true)}}><i className="fas fa-chevron-circle-right"></i></span>
        <div className="sidebar">
            <span className="close-sidebar" onClick={()=>setIsOpen(false)} ><i className="fas fa-times"></i></span>
            {children}
        </div>
    </div>
}

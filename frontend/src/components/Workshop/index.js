import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect, createContext, useCallback} from "react";
import {getEntities,changeEntityPosition} from "../../store/entities";
import EntitiesTiles from "../EntitiesTiles";
import EntitiesTree from "../EntitiesTree";
import EntityDetails from "../EntityDetails";
import {TouchBackend} from 'react-dnd-touch-backend';
import {DndProvider} from 'react-dnd';
import Sidebar from "../Sidebar";
import SidebarWithTabs from "../SidebarWithTabs";

export const WorkshopContext = createContext()

export default function Workshop ({setPageTitle}) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [activeEntity, setActiveEntity] = useState();

    const user = useSelector(state => state.session.user)

    useEffect(()=>{
        setPageTitle("Workshop");
    },[setPageTitle])

    useEffect(()=>{
        if (user!==null){
            document.title = `Writer's Friend - Workshop`;
            dispatch(getEntities()).then(res => { setIsLoaded(true) });
        }
    },[dispatch, user])

    const moveEntity = useCallback((entity, locally) => {
        return dispatch(changeEntityPosition(entity,locally))
    },[dispatch])

    return isLoaded && <>
            <DndProvider backend={TouchBackend} options={{enableMouseEvents:true}}>
            <WorkshopContext.Provider value={{moveEntity,setActiveEntity,activeEntity}}>
                <SidebarWithTabs 
                    isOpen={isOpen} 
                    setIsOpen={setIsOpen}
                    showOnMobile={true}
                    showOnDesktop={false}
                    tabs={["Works","Details"]}
                    >
                    <div className="one">
                        <EntitiesTree />
                    </div>
                    <div className="two">
                        <EntityDetails entity={activeEntity} />
                    </div>
                </SidebarWithTabs>
                <Sidebar 
                    isOpen={isOpen} 
                    setIsOpen={setIsOpen} 
                    active={true}
                    showOnMobile={false}
                    showOnDesktop={true} >
                    <EntitiesTree />
                </Sidebar>
                <div className={`main-content${isOpen?" open":""}`}>
                    <div className="flex-cols">
                        <div>
                            <EntitiesTiles />
                        </div>
                        <EntityDetails entity={activeEntity} showOnMobile={false} showOnDesktop={true} />
                    </div>
                </div>
            </WorkshopContext.Provider>
            </DndProvider>
    </>
}
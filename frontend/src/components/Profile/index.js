import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import Cookies from "js-cookie";
import {getEntities} from "../../store/entities";
import {quickStart} from "../../store/scenes";
import EntitiesList from "./EntitiesList";
import PseudonymsList from "../Pseudonyms";
import PageNotFound from "../PageNotFound";
import {getAuthorFormattedPseudonym} from "../Profile/utils";

export default function Profile () {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isAuthorized, setAuthorized] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activePseudonym, setActivePseudonym] = useState();
    const [isOpen, setIsOpen] = useState("entities");
    const tabsList = ["entities","pseudonyms"];

    let user = useSelector(state => state.session.user)
    const pseudonyms = useSelector(state=> state.pseudonyms);

    useEffect(()=>{
        if (user){
            document.title = `Writer's Friend - Workshop`;
            setAuthorized(true);
            if (Cookies.get("profile-open") && tabsList.includes(Cookies.get("profile-open"))){
                setIsOpen(Cookies.get("profile-open"))
            }else {
                Cookies.set("profile-open","entities")
            }
            dispatch(getEntities()).then(res=>{setIsLoaded(true)});
        } else {
            setAuthorized(false);
        }
    },[dispatch, user])

    useEffect(()=>{
        setActivePseudonym(pseudonyms.find(pseudo => pseudo.isActive))
    },[pseudonyms])

    const onQuickStart = () =>{
        dispatch(quickStart()).then(id => {
            if (id) {
                history.push(`/scenes/${id}`)
            }
        })
    }

    const changeTab = (tab) => {
       if (tabsList.includes(tab)) {
           Cookies.set("profile-open",tab)
           setIsOpen(tab)
       }
    }

    if (!isAuthorized) {
        return <PageNotFound />
    } else {
        return isLoaded && <>
        
        <div className={`main-content`}>
            <div className="profile-header"><h1>Hello, {activePseudonym? getAuthorFormattedPseudonym(activePseudonym) : user.username}</h1><button onClick={onQuickStart}>Start Writing</button></div>
            <div className="mobile-nav">
                <span onClick={()=>{changeTab("pseudonyms")}} className={isOpen==="pseudonyms"?"open":""}>Pseudonyms</span>
                <span onClick={()=>{changeTab("entities")}} className={isOpen==="entities"?"open":""}>My creations</span>
            </div>
            {isOpen==="pseudonyms" && <PseudonymsList />}
            {isOpen==="entities" && <EntitiesList />}
        </div>
        </>
    }
}
import {useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {getAuthorFormattedPseudonym} from "../Workshop/utils";

export default function Profile ({setPageTitle}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activePseudonym, setActivePseudonym] = useState();

    const user = useSelector(state => state.session.user)
    const pseudonyms = useSelector(state=> state.pseudonyms);
    
    useEffect(()=>{
        setPageTitle("Profile");
    },[setPageTitle])

    useEffect(()=>{
        setActivePseudonym(pseudonyms.find(pseudo => pseudo.isActive))
        setIsLoaded(true);
        document.title = `Writer's Friend - Profile`;
    },[pseudonyms])

    return isLoaded && <div className="main-content">
        <h1>Hello, {activePseudonym? getAuthorFormattedPseudonym(activePseudonym) : user.username}</h1>
    </div>
}
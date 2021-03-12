import {useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {getAuthorFormattedPseudonym} from "../Workshop/utils";

export default function Profile () {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activePseudonym, setActivePseudonym] = useState();

    const user = useSelector(state => state.session.user)
    const pseudonyms = useSelector(state=> state.pseudonyms);

    useEffect(()=>{
        setActivePseudonym(pseudonyms.find(pseudo => pseudo.isActive))
        setIsLoaded(true);
        document.title = `Writer's Friend - Profile`;
    },[pseudonyms])

    return isLoaded && <>
        <h1>Hello, {activePseudonym? getAuthorFormattedPseudonym(activePseudonym) : user.username}</h1>
    </>
}
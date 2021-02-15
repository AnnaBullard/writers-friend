import Logo from "../Logo";
import {useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import ProfileButton from '../Navigation/ProfileButton';
import LoginFormModal from '../LoginFormModal';
import {getAuthorFormattedPseudonym} from "../Profile/utils";

export default function HomeNavBar () {
    const sessionUser = useSelector(state => state.session.user);
    const pseudonyms = useSelector(state=> state.pseudonyms);
    const [activePseudonym, setActivePseudonym] = useState();
  
    useEffect(()=>{
      setActivePseudonym(pseudonyms.find(pseudo => pseudo.isActive))
      document.title = `Writer's Friend`
    },[pseudonyms])

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
        <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
        <>
            <LoginFormModal />
        </>
        );
    }

    return <div className="home-logo-navbar">
        <Logo extraClass="home" />
        <div>
            <span>{`Welcome, ${sessionUser?(getAuthorFormattedPseudonym(activePseudonym) || sessionUser.username):"stranger"}!` }</span>
            <span>{sessionLinks}</span>
        </div>
    </div>
}

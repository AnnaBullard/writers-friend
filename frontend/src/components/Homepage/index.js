import Logo from "../Logo";
import {useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import ProfileButton from '../Navigation/ProfileButton';
import LoginFormModal from '../LoginFormModal';
import {getAuthorFormattedPseudonym} from "../Workshop/utils";

export default function Homepage ({themeSettings, setPageTitle}) {
    setPageTitle();
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
        <ProfileButton user={sessionUser} themeSettings={themeSettings}/>
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
            <span className="nav-links">{sessionLinks}</span>
        </div>
    </div>
}

import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import Logo from "../Logo";

function Navigation({ isLoaded, themeSettings, pageTitle }){
  const sessionUser = useSelector(state => state.session.user);

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

  return (
    <div className="navbar">
        <span><Logo /></span>
        <span className="page-title">{pageTitle}</span>
        <span className="nav-links">{isLoaded && sessionLinks}</span>
    </div>
  );
}

export default Navigation;

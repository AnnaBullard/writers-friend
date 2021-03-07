import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, Link } from "react-router-dom";
import * as sessionActions from '../../store/session';
import Theme from "../Theme";

function ProfileButton({ user, themeSettings }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };
  
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);
  
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(res => {history.push("/")})
  };

  return (
    <>
      <Link to="/profile">
        <i className="fas fa-user-circle" title="Profile"></i>
      </Link>
      <Link to="/pseudonyms">
        <i className="fas fa-theater-masks" title="Pseudonyms"></i>
      </Link>
      <Link to="/workshop">
        <i className="fas fa-book" title="Workshop"></i>
      </Link>
      <button onClick={openMenu}>
        <i className="fas fa-palette" title="Theme"></i>
      </button>
      {showMenu && (
        <ul className="profile-dropdown">
            <Theme themeSettings={themeSettings} />
        </ul>
      )}
      <button onClick={logout} title="Log Out" className="logout" >
        <i className="fas fa-door-open"></i><span>Log Out</span>
      </button>
    </>
  );
}

export default ProfileButton;

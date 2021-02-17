import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import * as sessionActions from '../../store/session';

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

  const changeTheme = (themeName) => {
    if (themeSettings.themeList.includes(themeName)) {
      themeSettings.setTheme(themeName);
      Cookies.set('color-theme',themeName)
    }
  }

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      {showMenu && (
        <ul className="profile-dropdown">
          <li>
            <Link to ="/profile" >Workshop</Link>
          </li>
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
          <li>
            <div>
              <span className={`theme-button peach-theme${themeSettings.theme==="peach"?" active":""}`} onClick={()=>{changeTheme('peach')}} ></span>
              <span className={`theme-button beach-theme${themeSettings.theme==="beach"?" active":""}`} onClick={()=>{changeTheme('beach')}} ></span>
            </div>
          </li>
        </ul>
      )}
    </>
  );
}

export default ProfileButton;

import Cookies from 'js-cookie';

export default function Theme({themeSettings}){
    
  const changeTheme = (themeName) => {
    if (themeSettings.themeList.includes(themeName)) {
      themeSettings.setTheme(themeName);
      Cookies.set('color-theme',themeName)
    }
  }

    return <>
        {themeSettings.themeList
        .map((theme, idx)=>
            <span className={`theme-button ${theme}-theme${theme===themeSettings.theme?" active":""}`} 
            onClick={()=>{changeTheme(theme)}} key={`theme-${idx}`} ></span>
        )}
    </>
}
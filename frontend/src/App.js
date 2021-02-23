import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Cookies from 'js-cookie';
import * as sessionActions from "./store/session";
import {getPseudonyms} from "./store/pseudonyms";
import Navigation from "./components/Navigation";
import Homepage from "./components/Homepage";
import ScenesPage from "./components/ScenesPage";
import Profile from "./components/Profile";
import Story from "./components/Story";
import PageNotFound from "./components/PageNotFound";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState("peach")
  const themeList = useMemo(()=>["peach", "beach", "midnight", "dark"],[]);
  

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => {
        if (Cookies.get('color-theme') && themeList.includes(Cookies.get('color-theme'))) {
          setTheme(Cookies.get('color-theme'))
        } else {
          Cookies.set('color-theme','peach')
        }
        setIsLoaded(true)
      });
  }, [dispatch, themeList]);

  useEffect(()=>{
    if (user) dispatch(getPseudonyms())
  },[user, dispatch])

  useEffect(()=>{
    document.body.setAttribute("class", "")
    document.body.classList.add(theme)
  },[theme])

  return (
    <>
      <Navigation isLoaded={isLoaded} themeSettings={{theme, setTheme, themeList}}/>
      <div className="page-content">
        {isLoaded && (
          <Switch>
            <Route exact path="/">
              <Homepage themeSettings={{theme, setTheme, themeList}} />
            </Route>
            <Route path="/scenes/:chapterId">
              <ScenesPage />
            </Route>
            <Route path="/story/:storyId">
              <Story />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route>
              <PageNotFound/>
            </Route>
          </Switch>
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;

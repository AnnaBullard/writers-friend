import React, { useState, useEffect } from "react";
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

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState("peach")
  const themeList = ["peach", "beach"]

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => {
        if (Cookies.get('color-theme') && themeList.includes(Cookies.get('color-theme'))) {
          console.log("cookie", Cookies.get('color-theme'))
          setTheme(Cookies.get('color-theme'))
        } else {
          Cookies.set('color-theme','peach')
        }
        setIsLoaded(true)
      });

  }, [dispatch]);

  useEffect(()=>{
    if (user) dispatch(getPseudonyms())
  },[user])

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
              <Homepage />
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
    </>
  );
}

export default App;

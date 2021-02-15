import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
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

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => {
        setIsLoaded(true)
      });
  }, [dispatch]);

  useEffect(()=>{
    if (user) dispatch(getPseudonyms())
  },[user])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
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

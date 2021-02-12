import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Homepage from "./components/Homepage";
import ScenesPage from "./components/ScenesPage";
import Profile from "./components/Profile";
import Profile2 from "./components/Profile2";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

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
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/profile2">
              <Profile2 />
            </Route>
          </Switch>
        )}
      </div>
    </>
  );
}

export default App;

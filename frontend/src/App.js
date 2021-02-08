import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Homepage from "./components/Homepage";
import BlocksList from "./components/BlocksList";
import ScenesPage from "./components/ScenesPage";

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
            <Route path="/test">
              <BlocksList text={"This is a great day to be alive\n\nWhat do you think?"}/>
            </Route>
            <Route path="/scenes/:chapterId">
              <ScenesPage />
            </Route>
          </Switch>
        )}
      </div>
    </>
  );
}

export default App;

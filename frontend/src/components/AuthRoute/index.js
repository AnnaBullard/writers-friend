import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import PageNotFound from "../PageNotFound";


export default function AuthRoute (props) {
    const [isAuthorized, setAuthorized] = useState(false);

    const user = useSelector(state => state.session.user);

    useEffect(()=>{
        if (!user) setAuthorized(false);
        else setAuthorized(true);
    },[user]);

    if (!isAuthorized) return <PageNotFound />
    else return <Route {...props}>
        {props.children}
    </Route>
}
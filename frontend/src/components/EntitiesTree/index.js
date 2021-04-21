import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import EntitiesTreeList from "./EntitiesTreeList";

export default function EntitiesTree () {
    let entities = useSelector(state => state.entities);
    
    return <div className="entities-tree">
        <div><NavLink exact to="/workshop" className="join-block" activeClassName="active">All</NavLink></div>
        <EntitiesTreeList entities={entities} />
    </div>
}
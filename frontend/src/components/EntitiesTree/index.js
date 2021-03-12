import {useSelector} from "react-redux";
import EntitiesTreeList from "./EntitiesTreeList";

export default function EntitiesTree () {
    let entities = useSelector(state => state.entities);
    
    return <div className="entities-tree">
        <EntitiesTreeList entities={entities} />
    </div>;
}
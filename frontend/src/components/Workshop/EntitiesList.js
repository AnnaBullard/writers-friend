import {useSelector} from "react-redux";
import NewEntity from "./NewEntity";
import EntityBlock from "./EntityBlock";

export default function EntitiesList () {
    let entities = useSelector(state => state.entities)

    return <div className={`entities-grid`} >
        {entities.map((entity,idx) => 
            <EntityBlock entity={entity} key={`drop-0-drop-${idx}`} />
        )}
        <NewEntity />
    </div>
}
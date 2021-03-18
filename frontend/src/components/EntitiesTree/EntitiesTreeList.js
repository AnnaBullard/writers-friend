import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import EntityTreeItem from "./EntityTreeItem";
import Position from "./Position";

export default function EntitiesTreeList ({entities}) {
    let stateEntities = useSelector(state => state.entities);
    
    const [list, setList] = useState([]);
    
    useEffect(()=>{
        if (!entities && stateEntities.length) 
            setList(stateEntities.filter(entity => entity.typeId !== 1))
        else if (entities) 
            setList(entities.filter(entity => entity.typeId !== 1))
    },[stateEntities, entities])
    
    return <>
        {list.map(entity => 
            <EntityTreeItem key={`entity-tree-${entity.id}`} entity={entity} />
         )}
         <Position parentId={entities[0].parentId} />
    </>;
}
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import EntityTreeItem from "./EntityTreeItem";
import Position from "./Position";

export default function EntitiesTreeList ({entities, parentTypeId}) {
    let stateEntities = useSelector(state => state.entities);
    
    parentTypeId = parentTypeId?parentTypeId:+Infinity;

    const [list, setList] = useState([]);
    
    useEffect(()=>{
        if (!entities && stateEntities.length) 
            setList(stateEntities)
        else if (entities) 
            setList(entities)
    },[stateEntities, entities])
    
    return <>
        {list.map(entity => <>
            <Position parentId={entity.parentId} order={entity.order} parentTypeId={parentTypeId} last={false} />
            <EntityTreeItem key={`entity-tree-${entity.id}`} entity={entity}  parentTypeId={parentTypeId}/>
            </>
         )}
        {parentTypeId!==2 && <Position parentId={entities[0].parentId} parentTypeId={parentTypeId} last={true}/>}
    </>;
}
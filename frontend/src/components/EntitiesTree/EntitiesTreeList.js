import {useEffect, useState, Fragment} from "react";
import {useSelector} from "react-redux";
import Join from "./Join";
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
        {list.map((entity, idx) => <Join entity={entity} parentTypeId={parentTypeId} idx={idx} key={`entity-tree-${entity.id}`}/>)}
        {parentTypeId!==2 && <Position parentId={entities[0].parentId} parentTypeId={parentTypeId} last={true}/>}
    </>;
}
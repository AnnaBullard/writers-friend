import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";

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
        {list.map(entity => {
            return <div key={`entity-tree-${entity.id}`}>
                <NavLink to={`/workshop/${entity.id}`} activeClassName="active-entity">{entity.title}</NavLink>
                {entity.children && entity.children.length > 0 && <EntitiesTreeList entities={entity.children} />}
            </div>
        })}
    </>;
}
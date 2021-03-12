import { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import EntityBlock from "./EntityBlock";
import Breadcrumbs from "./Breadcrumbs";
import NewEntity from "./NewEntity";
import {getTarget} from "../Workshop/utils";

export default function EntitiesTiles () {
    let entities = useSelector(state => state.entities);
    let {entityId} = useParams();

    const [targetEntity, setTargetEntity] = useState()
    
    useEffect(()=>{
        if(entityId) {
            setTargetEntity(getTarget(parseInt(entityId),entities))
        }else {
            setTargetEntity()
        }

    },[entityId, entities]);
    
    return <div>
        <Breadcrumbs />
        <div className="entities-tiles">
            {!!targetEntity && !!targetEntity.children 
            && targetEntity.children.map(entity => <EntityBlock entity={entity} key={`entity-${entity.id}`}/>)}
            {!targetEntity && entities.map(entity => <EntityBlock entity={entity} key={`entity-${entity.id}`}/>)}
            <NewEntity parentEntity={targetEntity} />
        </div>
    </div>;
}
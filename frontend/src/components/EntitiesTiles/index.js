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

    const [targetEntity, setTargetEntity] = useState();
    const [prev, setPrev] = useState();
    
    useEffect(()=>{
        if(entityId) {
            setTargetEntity(getTarget(parseInt(entityId),entities))
        }else {
            setTargetEntity()
        }
    },[entityId, entities]);

    useEffect(()=>{
        console.log("prev", prev)
    },[prev])

    let renderBlock = (entity, idx) => {
        return <EntityBlock entity={entity} key={`entity-${entity.id}`} idx={idx} prev={prev} setPrev={setPrev} />
    }
    
    return <div>
        <Breadcrumbs />
        <div className="entities-tiles">
            {!!targetEntity && !!targetEntity.children 
            && targetEntity.children.map(renderBlock)}
            {!targetEntity && entities.map(renderBlock)}
            <NewEntity parentEntity={targetEntity} />
        </div>
    </div>;
}
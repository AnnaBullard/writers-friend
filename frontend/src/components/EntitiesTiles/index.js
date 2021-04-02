import { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import EntityBlock from "./EntityBlock";
import Breadcrumbs from "./Breadcrumbs";
import NewEntity from "./NewEntity";
import TilePosition from "./TilePosition";
import {getTarget} from "../Workshop/utils";

export default function EntitiesTiles () {
    let entities = useSelector(state => state.entities);
    let {entityId} = useParams();

    const [targetEntity, setTargetEntity] = useState();
    
    useEffect(()=>{
        if(entityId) {
            setTargetEntity(getTarget(parseInt(entityId),entities))
        }else {
            setTargetEntity()
        }
    },[entityId, entities]);

    let renderBlock = (entity, idx) => {
        return <EntityBlock entity={entity} key={`entity-${entity.id}`} idx={idx} targetEntity={targetEntity} />
    }
    
    return (!entityId || !!targetEntity) && <>
        <Breadcrumbs />
        <div className="entities-tiles">
            {!!targetEntity && !!targetEntity.children 
            && targetEntity.children.map(renderBlock)}
            {!targetEntity && entities.map(renderBlock)}
            <TilePosition order="last" parentId={targetEntity?targetEntity.id:null} parentTypeId={!targetEntity?100:targetEntity.typeId} />
            <NewEntity parentEntity={targetEntity} />
        </div>
    </>;
}
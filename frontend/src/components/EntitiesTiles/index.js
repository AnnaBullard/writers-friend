import {useEffect, useState, useContext} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import EntityBlock from "./EntityBlock";
import Breadcrumbs from "./Breadcrumbs";
import NewEntity from "./NewEntity";
import TilePosition from "./TilePosition";
import {getTarget} from "../Workshop/utils";
import {WorkshopContext} from "../Workshop";

export default function EntitiesTiles () {
    let entities = useSelector(state => state.entities);
    let {entityId} = useParams();

    const [targetEntity, setTargetEntity] = useState();

    const {setActiveEntity, activeEntity} = useContext(WorkshopContext);

    useEffect(()=>{
        if(entityId) {
            let foundEntity = getTarget(parseInt(entityId),entities, true);
            if (foundEntity.typeId === 1 && foundEntity.parentId) {
                setActiveEntity(foundEntity)
                setTargetEntity(getTarget(parseInt(foundEntity.parentId),entities))
            } else if (foundEntity.typeId === 1 && !foundEntity.parentId) {
                setActiveEntity(foundEntity)
                setTargetEntity();
            } else {
                setActiveEntity(foundEntity);
                setTargetEntity(foundEntity);
            }
        }else {
            setActiveEntity();
            setTargetEntity();
        }
    },[entityId, entities, setActiveEntity]);

    let renderBlock = (entity, idx) => {
        return <EntityBlock entity={entity} key={`entity-${entity.id}`} idx={idx} targetEntity={targetEntity} />
    }

    return (!entityId || !!targetEntity || !!activeEntity) && <>
        <Breadcrumbs />
        <div className="entities-tiles">
            {!!targetEntity && !!targetEntity.children 
            && targetEntity.children.map(renderBlock)}
            {!targetEntity && entities.map(renderBlock)}
            <TilePosition last={true} parentId={targetEntity?targetEntity.id:null} parentTypeId={!targetEntity?100:targetEntity.typeId} />
            <NewEntity parentEntity={targetEntity} />
        </div>
    </>;
}
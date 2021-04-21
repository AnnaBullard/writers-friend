import {NavLink, useHistory} from "react-router-dom";
import {useDrop, useDrag} from 'react-dnd';
import ItemTypes from "../Workshop/itemTypes";
import EntitiesTreeList from "./EntitiesTreeList";
import Position from "./Position";
import {useCallback, useContext, useState} from "react";
import {WorkshopContext} from "../Workshop";
import {getAuthorFormatted, getType} from "../Workshop/utils";

export default function Join ({entity, idx, parentTypeId}) {
    const [allowed, setAllowed] = useState(false);

    const history = useHistory();

    const {moveEntity, setActiveEntity} = useContext(WorkshopContext);
    
    const [{isOver}, drop] = useDrop(() => ({
        accept: [ItemTypes.ENTITY_TILE, ItemTypes.ENTITY_BRANCH],
        drop: (item, monitor) => {
            let origItem = {parentId: item.parentId, order: item.order}
            let res;
            if (entity.typeId > item.typeId) {
                res = moveEntity({id: item.id, parentId: entity.id})
            }
            if (res.error) {
                moveEntity(origItem, true)
            }
        },
        hover: (item, monitor) => {
            if (entity.typeId > item.typeId){
                setAllowed(true);
            } else {
                setAllowed(false)
            }
        },
        canDrop: (item, monitor) => (entity.typeId > item.typeId),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        }),
        
    }))

    const [{isDragging, getSourceClientOffset}, drag, dragPreview] = useDrag(()=>({
        item: {
            id: entity.id,
            parentId: entity.parentId,
            typeId: entity.typeId,
            type: ItemTypes.ENTITY_BRANCH,
            order: idx
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
            getSourceClientOffset: monitor.getClientOffset(),
        })
    }))

    return isDragging ? <div className="book-cover dragged" ref={dragPreview} style={{top: getSourceClientOffset?(getSourceClientOffset.y-30)+"px":"0", left: getSourceClientOffset?getSourceClientOffset.x+"px":"0"}}>
        <div className="book-header">
            <span className="entity-type" ref={drag}>
                {getType(entity)} 
            </span>
            <span className="book-title">"{entity.title || "untitled"}"</span>
            {!!entity.Pseudonym && <span className="book-author"> by {getAuthorFormatted(entity)}</span>}
        </div>
    </div> :
    <>
        <Position parentId={entity.parentId} order={idx} parentTypeId={parentTypeId} last={false} key={`entity-tree-position-${idx}`}/>
        <div>
            <NavLink to={`/workshop/${entity.id}`} className={`join-block${isOver&&allowed?" over":""}`} ref={drop}><span ref={drag}>{getType(entity)} {entity.title}</span></NavLink>
            {entity.typeId!==2 && entity.children && entity.children.length > 0 && <EntitiesTreeList entities={entity.children} parentTypeId={entity.typeId} />}
        </div>
    </>
}
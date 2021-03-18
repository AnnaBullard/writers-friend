import {NavLink} from "react-router-dom";
import { useDrop,useDrag } from 'react-dnd';
import ItemTypes from "../Workshop/itemTypes";
import {useContext, useState} from "react";
import {WorkshopContext} from "../Workshop";

export default function Join ({entity}) {
    const [allowed, setAllowed] = useState(false);

    const moveEntity = useContext(WorkshopContext);
    
    const [{isOver}, drop] = useDrop(() => ({
        accept: [ItemTypes.ENTITY_TILE, ItemTypes.ENTITY_BRANCH],
        drop: (item, monitor) => {
            if (entity.typeId > item.typeId)
                moveEntity({id: item.id, parentId: entity.id})
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

    const [{isDragging}, drag, dragPreview] = useDrag(()=>({
        item: {
            id: entity.id,
            parentId: entity.parentId,
            typeId: entity.typeId,
            type: ItemTypes.ENTITY_BRANCH
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }))

    return isDragging ? <div ref={dragPreview}></div> 
                      : <NavLink to={`/workshop/${entity.id}`} className={`join-block${isOver&&allowed?" over":""}`} ref={drop}><span ref={drag}>{entity.title}</span></NavLink>
}
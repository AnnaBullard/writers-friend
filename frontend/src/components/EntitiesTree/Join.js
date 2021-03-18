import {NavLink} from "react-router-dom";
import { useDrop } from 'react-dnd';
import ItemTypes from "../Workshop/itemTypes";
import {useContext, useState} from "react";
import {WorkshopContext} from "../Workshop";

export default function Join ({entity}) {
    const [allowed, setAllowed] = useState(false);

    const moveEntity = useContext(WorkshopContext);
    
    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.ENTITY_TILE,
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

    return <NavLink to={`/workshop/${entity.id}`} className={`join-block${isOver&&allowed?" over":""}`} ref={drop}>{entity.title}</NavLink>
}
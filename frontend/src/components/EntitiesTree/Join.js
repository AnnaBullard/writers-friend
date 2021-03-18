import {NavLink} from "react-router-dom";
import { useDrop } from 'react-dnd';
import ItemTypes from "../Workshop/itemTypes";
import {useContext} from "react";
import {WorkshopContext} from "../Workshop";

export default function Join ({entity}) {

    const moveEntity = useContext(WorkshopContext);
    
    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.ENTITY_TILE,
        drop: (item, monitor) => moveEntity({id: item.id, parentId: entity.id}),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    return <NavLink to={`/workshop/${entity.id}`} className={`join-block${isOver?" over":""}`} ref={drop}>{entity.title}</NavLink>
}
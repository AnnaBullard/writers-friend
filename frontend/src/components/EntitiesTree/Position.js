import { useDrop } from 'react-dnd';
import ItemTypes from "../Workshop/itemTypes";
import {useContext} from "react";
import {WorkshopContext} from "../Workshop";

export default function Position ({parentId, order}) {
    const moveEntity = useContext(WorkshopContext);

    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.ENTITY_TILE,
        drop: (item, monitor) => moveEntity({id: item.id, parentId, order}),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    return <div className={`position-divider${isOver?" over":""}`} ref={drop}></div>
}
import { useDrop } from 'react-dnd';
import ItemTypes from "../Workshop/itemTypes";
import {useContext, useState} from "react";
import {WorkshopContext} from "../Workshop";

export default function Position ({parentId, order, parentTypeId}) {
    const moveEntity = useContext(WorkshopContext);
    const [allowed, setAllowed] = useState(false);

    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.ENTITY_TILE,
        drop: (item, monitor) => {
            console.log({parentTypeId, item:item.typeId})
            if (parentTypeId > item.typeId)
                moveEntity({id: item.id, parentId, order})
        },
        hover: (item, monitor) => {
            if (parentTypeId > item.typeId){
                setAllowed(true);
            } else {
                setAllowed(false)
            }
        },
        // canDrop: (item, monitor) => (parentTypeId > item.typeId),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    return <div className={`position-divider${allowed && isOver?" over":""}`} ref={drop}></div>
}
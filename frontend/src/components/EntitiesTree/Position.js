import { useDrop } from 'react-dnd';
import ItemTypes from "../Workshop/itemTypes";
import {useContext, useState} from "react";
import {WorkshopContext} from "../Workshop";

export default function Position ({parentId, order, parentTypeId, last}) {
    const moveEntity = useContext(WorkshopContext);
    const [allowed, setAllowed] = useState(false);

    const [{isOver}, drop] = useDrop(() => ({
        accept: [ItemTypes.ENTITY_TILE, ItemTypes.ENTITY_BRANCH],
        drop: (item, monitor) => {
            if (parentTypeId > item.typeId){
                if (last) {
                    moveEntity({id: item.id, parentId, order:"last"})
                } else {
                    moveEntity({id: item.id, parentId, order})
                }
            }
        },
        hover: (item, monitor) => {
            if (parentTypeId > item.typeId){
                setAllowed(true);
            } else {
                setAllowed(false)
            }
        },
        canDrop: (item, monitor) => (parentTypeId > item.typeId),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }))

    return <div className={`position-divider${allowed && isOver?" over":""}${last?" last":""}`} ref={drop}></div>
}
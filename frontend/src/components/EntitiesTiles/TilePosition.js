import {useContext, useState} from "react";
import {useDrop} from "react-dnd";
import ItemTypes from "../Workshop/itemTypes";
import {WorkshopContext} from "../Workshop";

export default function TilePosition ({order, parentId, parentTypeId, last}) {
    const {moveEntity} = useContext(WorkshopContext);
    const [allowed, setAllowed] = useState(false);
    
    const [{isOver}, drop] = useDrop(() => ({
        accept: [ItemTypes.ENTITY_TILE, ItemTypes.ENTITY_BRANCH],
        drop: (item, monitor) => {
            if (parentTypeId > item.typeId){
                let origItem = {parentId: item.parentId, order: item.order}
                let res;
                if (last) {
                    res = moveEntity({id: item.id, parentId, order:"last"})
                } else {
                    res = moveEntity({id: item.id, parentId, order})
                }
                if (res.error) {
                    moveEntity(origItem, true)
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

    return <div className={`tile-position ${(isOver && allowed) ?"over":""}`} ref={drop}></div>
}
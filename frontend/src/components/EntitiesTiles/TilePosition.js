import {useContext, useState} from "react";
import {useDrop} from "react-dnd";
import ItemTypes from "../Workshop/itemTypes";
import {WorkshopContext} from "../Workshop";

export default function TilePosition ({order, parentId, parentTypeId, last}) {
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
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    return <div className={`tile-position ${isOver?"over":""}`} ref={drop}>
        <div style={{background: "red", borderRadius: isOver?"5px":"0", height: "100%", width:isOver?"230px":"10px", marginLeft: isOver?"10px":"0"}}></div>
    </div>
}
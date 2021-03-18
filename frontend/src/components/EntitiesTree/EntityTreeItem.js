import EntitiesTreeList from "./EntitiesTreeList";
import Join from "./Join";
import Position from "./Position";

export default function EntityTreeItem ({entity, parentTypeId})  {

    return <div >
        <Position parentId={entity.parentId} order={entity.order} parentTypeId={parentTypeId} last={false} />
        <Join entity={entity} />
        {entity.children && entity.children.length > 0 && <EntitiesTreeList entities={entity.children} parentTypeId={entity.typeId} />}
    </div>
}
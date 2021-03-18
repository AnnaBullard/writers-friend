import EntitiesTreeList from "./EntitiesTreeList";
import Join from "./Join";

export default function EntityTreeItem ({entity, parentTypeId})  {

    return <div >
        <Join entity={entity} />
        {entity.typeId!==2 && entity.children && entity.children.length > 0 && <EntitiesTreeList entities={entity.children} parentTypeId={entity.typeId} />}
    </div>
}
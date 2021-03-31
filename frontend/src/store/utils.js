let findEntity = (array, id) => {
    let queue = [...array]
    let i = 0;
    while (i < queue.length) {
        let current = queue[i]
        if (current.id === id) return(current)
        else {
            if (current.children) queue.push(...current.children);
        }
        i++;
    }
    return null;
}

let findPath = (arr, id, child) => {
    if (!arr|| (arr && arr.length === 0)) return [];
    //find node in the tree
    child = child?child:findEntity(arr, id)

    //if parent find in the top level - return array with 1 parent
    let parent = arr.find(item => item.id === child.parentId)
    if (parent) return [parent.parentId];

    //else 
    //for each item in array recursively search
    let newArr = [];
    arr.forEach(item => {
        newArr.push(...findPath(item.children, id, child))
    })
    //if at least on of the children return not empty array add parent of current level to the returned array
    if (newArr.length && arr[0].parentId) {
        newArr = [arr[0].parentId, ...newArr];
    }

    return newArr;
}

let deleteFn = (siblings, child) => {
    return siblings.filter(entity => entity.id !== child.id)
                   .map((entity, idx) => ({...entity, order: idx}))
}

let updateFn = (siblings, child) => {
    return siblings.map(entity => {
        if (entity.id === child.id) {
            return {...entity, ...child}
        } else {
            return {...entity}
        }
    })
}

let addFn = (siblings, child) => {
    let newChild = {...child}
    if (siblings) {
        newChild.order = siblings.length;
        return [...siblings, newChild]
    } else {
        newChild.order = 0
        return [newChild]
    }
}

let addAtFn = (siblings, child) => {
    return [...siblings.slice(0,child.order),child,...siblings.slice(child.order)]
                .map((entity, idx) => ({...entity, order: idx}))
}

let copyArray = (array, child, path, cb) => {
    let newArr = [];
    for (let i = 0; i < array.length; i++) {
        let item = {...array[i]};
        if (item.id===child.parentId) {
            let childrenArray = cb(item.children, child)
            item.children = childrenArray;
        } else if (path.includes(item.id)) {
            item.children = copyArray(item.children, child, path, cb)
        }
        newArr.push(item);
    }
    return newArr
}

let deepCopy = (array) =>{
    let newArray = []

    if (array) {
        newArray.push(...array.map(item=>{
            let newItem = {...item};
            if (item.children){
                let newChildren = deepCopy(item.children);
                newItem.children = newChildren
            }
            return newItem
        }))
    }

    return newArray;
}

export let removeEntity = (array, id) => {
    let child = findEntity(array, id);
    
    if (!child.parentId){
        return deleteFn(array, child);
    }

    let path = findPath(array, child.id, child);

    return copyArray(array, child, path, deleteFn);

}

export let addEntity = (array, child) => {
    if (!child.parentId && child.order===undefined) return addFn(array, child);

    if (!child.parentId && child.order!==undefined) return addAtFn(array, child);
    
    let path = findPath(array, child.id, child);
    
    if (child.order===undefined) return copyArray(array, child, path, addFn);
    
    return copyArray(array, child, path, addAtFn);
}

export let updateEntity = (array, child) => {
    let oldChild = findEntity(array, child.id);

    let newChild = {...oldChild, ...child};

    if (child.order===undefined) delete newChild.order;
    
    let newArray = deepCopy(array);

    if (oldChild.parentId !== newChild.parentId 
        || (newChild.order!==undefined && oldChild.order !== newChild.order)) {
        newArray = removeEntity(array, oldChild.id);
        if (newChild.order === "last"){
            delete newChild.order;
        } else if (oldChild.parentId === newChild.parentId && newChild.order > oldChild.order) {
            newChild.order--;
        }
        newArray = addEntity(newArray, newChild);
    } else {
        let path = findPath(array, newChild.id)
        newArray = copyArray(array, newChild, path, updateFn)
    }


    return newArray;

}

export const deepSort = (entitiesArray) => {
    let arr = entitiesArray.sort((a,b)=>{
        let result
        if (a.order<b.order || (a.order===b.order && a.title < b.title)) result = -1;
        else result = 1;
        return result;
    })
    arr = arr.map(entity=>{
        if (entity.typeId > 1 && entity.children && entity.children.length){
            entity.children = deepSort(entity.children);
        } 
        return entity

    })
    return arr
}
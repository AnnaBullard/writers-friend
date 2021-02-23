export let findPath = (arr, child) => {
    if (!arr|| (arr && arr.length === 0)) return [];
    
    let parent = arr.find(item => item.id === child.parentId)
    if (parent) return [parent.parentId];

    let newArr = [];
    arr.forEach(item => {
        newArr.push(...findPath(item.children, child))
    })

    if (newArr.length && arr[0].parentId) {
        newArr = [arr[0].parentId, ...newArr];
    }

    return newArr;
}

export let updateEntity = (entityArray, child) => {
    
    if (!child.parentId){
        let newArray = [];
        for (let j = 0; j < entityArray.length; j++) {
            if (entityArray[j].id === child.id) {
                newArray.push({...entityArray[j],...child})
            } else {
                newArray.push(entityArray[j])
            }
        }
        return newArray;
    }

    let path = findPath(entityArray, child);

    let copyArray = (array, child, path) => {
        let newArr = [];
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            if (item.id===child.parentId) {
                let childrenArray = [];
                for (let j = 0; j < item.children.length; j++) {
                    if (item.children[j].id === child.id){
                        childrenArray.push({...item.children[j],...child })
                    } else {
                        childrenArray.push(item.children[j])
                    }
                }
                item.children = childrenArray;
            } else if (path.includes(item.id)) {
                item.children = copyArray(item.children, child, path)
            }
            newArr.push(item);
        }
        return newArr
    }

    return copyArray(entityArray, child, path);

}


export let addEntity = (entityArray, child) => {
    
    if (!child.parentId){
        return [...entityArray, child];
    }

    let path = findPath(entityArray, child);

    let copyArray = (array) => {
        let newArr = [];
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            if (item.id===child.parentId) {
                item.children = [...item.children, child];
            } else if (path.includes(item.id)) {
                item.children = copyArray(item.children)
            }
            newArr.push(item);
        }
        return newArr
    }

    return copyArray(entityArray, child, path);
}
